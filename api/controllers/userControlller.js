const { ObjectId, toObjectId } = require("../utils/objectId");
const db = require("../config/connection");
const { hashPassword, comparePassword, generateOTP, signToken, generateResetToken, verifyResetToken } = require("../utils/crypto");
const { sendSuccess, sendError } = require("../utils/response");
const { sendOtpEmail } = require("../utils/mailer");

const userController = {};

// 1. User Signin
userController.UserSignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, 400, "Please provide both email and password.");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await db.collection("User").findOne({ email: normalizedEmail });

        if (!user) {
            return sendError(res, 401, "Invalid Email or Password!");
        }

        const { match, needsRehash } = comparePassword(password, user.password);
        if (!match) {
            return sendError(res, 401, "Invalid Email or Password!");
        }

        // Automatic password hashing upgrade for legacy accounts
        if (needsRehash) {
            const upgradedHash = hashPassword(password);
            await db.collection("User").updateOne({ _id: user._id }, { $set: { password: upgradedHash } });
        }

        const payload = {
            id: user._id.toString(),
            email: user.email,
            fullName: user.fullName,
            role: "user",
        };

        const token = signToken(payload, "24h");
        return sendSuccess(res, 200, "User SignIn Successfully!", { token }, { token });
    } catch (e) {
        next(e);
    }
};

// 2. User Registration
userController.UserRegistration = async (req, res, next) => {
    try {
        const { fullName, email, password, mobile, address } = req.body;

        if (!fullName || !email || !password) {
            return sendError(res, 400, "Full Name, Email, and Password are required fields.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 400, "Invalid email address format.");
        }

        if (password.length < 6) {
            return sendError(res, 400, "Password must be at least 6 characters long.");
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check for duplicate account
        const existingUser = await db.collection("User").findOne({ email: normalizedEmail });
        if (existingUser) {
            return sendError(res, 409, "An account with this email already exists.");
        }

        const hashedPassword = hashPassword(password);
        const newUser = {
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            mobile: mobile ? mobile.trim() : "",
            address: address ? address.trim() : "",
            role: "user",
            createdAt: new Date(),
        };

        const result = await db.collection("User").insertOne(newUser);
        return sendSuccess(res, 201, "User Registered Successfully!", { id: result.insertedId });
    } catch (e) {
        next(e);
    }
};

// 3. User Forget Password
userController.UserForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return sendError(res, 400, "Email address is required.");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await db.collection("User").findOne({ email: normalizedEmail });

        if (!user) {
            return sendError(res, 400, "Invalid Email Address!");
        }

        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.collection("OTP").updateOne(
            { email: normalizedEmail, role: "user" },
            {
                $set: {
                    otp: otp,
                    role: "user",
                    expiresAt: expiryTime,
                    verified: false,
                    updatedAt: new Date(),
                },
            },
            { upsert: true }
        );

        await sendOtpEmail(normalizedEmail, otp);
        return sendSuccess(res, 200, "OTP sent to your email.");
    } catch (e) {
        next(e);
    }
};

// 4. User Verify OTP
userController.UserVerifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return sendError(res, 400, "Email and OTP are required.");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const otpDoc = await db.collection("OTP").findOne({ email: normalizedEmail, role: "user" });

        if (!otpDoc) {
            return sendError(res, 400, "No OTP found for this Email Address.");
        }

        const currentTime = new Date();
        if (otpDoc.expiresAt <= currentTime) {
            return sendError(res, 400, "OTP has expired. Please request a new one.");
        }

        if (otpDoc.otp !== otp.trim()) {
            return sendError(res, 400, "Invalid OTP.");
        }

        await db.collection("OTP").updateOne(
            { _id: otpDoc._id },
            { $set: { verified: true, verifiedAt: new Date() } }
        );

        const resetToken = generateResetToken(normalizedEmail, "user");
        return sendSuccess(res, 200, "OTP is valid and Verified Successfully!", { resetToken }, { resetToken });
    } catch (e) {
        next(e);
    }
};

// 5. User Reset Password
userController.UserResetPassword = async (req, res, next) => {
    try {
        const { email, newpassword, confirmpassword, resetToken } = req.body;

        if (!email || !newpassword || !confirmpassword) {
            return sendError(res, 400, "Email and new passwords are required.");
        }

        if (newpassword !== confirmpassword) {
            return sendError(res, 400, "New Password and Confirm Password does not match.");
        }

        if (newpassword.length < 6) {
            return sendError(res, 400, "Password must be at least 6 characters long.");
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Verification check: resetToken or verified OTP in database
        let isAuthorized = false;
        if (resetToken) {
            const tokenData = verifyResetToken(resetToken, "user");
            if (tokenData && tokenData.email.toLowerCase() === normalizedEmail) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            const otpDoc = await db.collection("OTP").findOne({
                email: normalizedEmail,
                role: "user",
                verified: true,
                expiresAt: { $gt: new Date() }
            });
            if (otpDoc) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return sendError(res, 403, "Unauthorized: Please verify your OTP before resetting password.");
        }

        const hashedPassword = hashPassword(newpassword);
        const result = await db.collection("User").updateOne(
            { email: normalizedEmail },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return sendError(res, 404, "User account not found.");
        }

        // Clean up OTP document
        await db.collection("OTP").deleteMany({ email: normalizedEmail, role: "user" });

        return sendSuccess(res, 200, "Password reset Successfully!");
    } catch (e) {
        next(e);
    }
};

// 6. User Change Password
userController.UserChangePassword = async (req, res, next) => {
    try {
        const { currentpassword, newpassword, confirmpassword } = req.body;

        if (!currentpassword || !newpassword || !confirmpassword) {
            return sendError(res, 400, "All password fields are required.");
        }

        if (newpassword !== confirmpassword) {
            return sendError(res, 400, "New Password and Confirm Password do not match!");
        }

        if (newpassword.length < 6) {
            return sendError(res, 400, "New password must be at least 6 characters long.");
        }

        const userObjId = toObjectId(req.userInfo.id);
        const user = await db.collection("User").findOne({ _id: userObjId });

        if (!user) {
            return sendError(res, 404, "User not found.");
        }

        const { match } = comparePassword(currentpassword, user.password);
        if (!match) {
            return sendError(res, 400, "Current Password is Incorrect!");
        }

        const hashedPassword = hashPassword(newpassword);
        await db.collection("User").updateOne({ _id: userObjId }, { $set: { password: hashedPassword } });

        return sendSuccess(res, 200, "Password Updated Successfully!");
    } catch (e) {
        next(e);
    }
};

// 7. Show pet based on ID (for adoption view)
userController.AdoptPets = async (req, res, next) => {
    try {
        const { id } = req.params;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid Pet ID format.");
        }

        const result = await db
            .collection("Pets")
            .aggregate([
                { $match: { _id: objId } },
                {
                    $lookup: {
                        from: "Category",
                        localField: "petType",
                        foreignField: "_id",
                        as: "petTypeCategory",
                    },
                },
                {
                    $unwind: { path: "$petTypeCategory", preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: "SubCategory",
                        localField: "petBreed",
                        foreignField: "_id",
                        as: "petBreedSubCategory",
                    },
                },
                {
                    $unwind: { path: "$petBreedSubCategory", preserveNullAndEmptyArrays: true },
                },
                {
                    $project: {
                        petName: 1,
                        petcolor: 1,
                        petWeight: 1,
                        petGender: 1,
                        petAge: 1,
                        vaccinated: 1,
                        friendlyToOtherPets: 1,
                        childrenFriendly: 1,
                        isAvailable: 1,
                        petTypeCategory: { $ifNull: ["$petTypeCategory.categoryName", "N/A"] },
                        petBreedSubCategory: { $ifNull: ["$petBreedSubCategory.subcategory", "N/A"] },
                        petPhoto: 1,
                        aboutPet: 1,
                    },
                },
            ])
            .toArray();

        return sendSuccess(res, 200, "Data Fetched Successfully", result);
    } catch (e) {
        next(e);
    }
};

// 8. Submit Adoption Request (Fixed missing await!)
userController.MainAdoptPets = async (req, res, next) => {
    try {
        const userObjId = toObjectId(req.userInfo.id);
        if (!userObjId) {
            return sendError(res, 401, "Invalid user session.");
        }

        const { petId, fullName, email, mobile, address, reason, occupation, residenceType } = req.body;
        const petObjId = toObjectId(petId);

        const payload = {
            ...req.body,
            userId: userObjId,
            petId: petObjId ? petObjId.toString() : petId,
            adoptionStatus: "Pending",
            createdAt: new Date(),
        };

        // Critical Fix: Added await
        const result = await db.collection("Adoption").insertOne(payload);

        return sendSuccess(
            res,
            201,
            "Pet Adoption Request has been sent Successfully!!. Please Check the Response Until it was Accepted!!",
            { id: result.insertedId }
        );
    } catch (e) {
        next(e);
    }
};

// 9. Get Pet Gallery Data
userController.GetGalleryData = async (req, res, next) => {
    try {
        const { id } = req.params;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid Pet ID format.");
        }

        const result = await db.collection("PetsGallery").find({ petId: objId }).toArray();
        return sendSuccess(res, 200, "Gallery Data Fetched Successfully", result);
    } catch (e) {
        next(e);
    }
};

// 10. Get User Profile Data (Password excluded!)
userController.GetUserData = async (req, res, next) => {
    try {
        const userObjId = toObjectId(req.userInfo.id);
        if (!userObjId) {
            return sendError(res, 401, "Invalid session identifier.");
        }

        const result = await db
            .collection("User")
            .find({ _id: userObjId }, { projection: { password: 0 } })
            .toArray();

        return sendSuccess(res, 200, "User Data Fetched Successfully", result);
    } catch (e) {
        next(e);
    }
};

// 11. User Pending Adoption Requests (CRITICAL BUG FIXED!)
userController.UserPendingRequestData = async (req, res, next) => {
    try {
        // Critical Fix: Previously was `const userId = req.userInfo; new ObjectId(userId)` which threw a fatal error!
        const userId = req.userInfo.id;
        const userObjId = toObjectId(userId);

        if (!userObjId) {
            return sendError(res, 401, "Invalid user session.");
        }

        const result = await db
            .collection("Adoption")
            .find({ userId: userObjId })
            .sort({ createdAt: -1 })
            .toArray();

        return sendSuccess(res, 200, "Adoption Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 12. User Feedback Submission
userController.UserFeedback = async (req, res, next) => {
    try {
        const { petId, feedback } = req.body;
        const userId = req.userInfo ? req.userInfo.id : req.body.userId;

        if (!feedback || !feedback.trim()) {
            return sendError(res, 400, "Feedback text is required.");
        }

        const userObjId = toObjectId(userId);
        const petObjId = toObjectId(petId);

        const feedbackData = {
            userId: userObjId,
            petId: petObjId,
            feedback: feedback.trim(),
            createdAt: new Date(),
        };

        const result = await db.collection("Feedback").insertOne(feedbackData);
        return sendSuccess(res, 201, "Feedback Added Successfully!!", { id: result.insertedId });
    } catch (e) {
        next(e);
    }
};

// 13. Showing all gallery photos
userController.GetAllPetGalleryData = async (req, res, next) => {
    try {
        const result = await db.collection("PetsGallery").find().sort({ createdAt: -1 }).toArray();
        return sendSuccess(res, 200, "Gallery Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 14. Report Homeless / Found Pet
userController.ReportFoundPet = async (req, res, next) => {
    try {
        const { petType, petColor, location, description, reporterName, reporterPhone } = req.body;

        const reportData = {
            ...req.body,
            reportedBy: req.userInfo ? req.userInfo.id : "Anonymous",
            createdAt: new Date(),
        };

        const result = await db.collection("HomelessPets").insertOne(reportData);
        return sendSuccess(res, 201, "Homeless Pet Reported Successfully!!", { id: result.insertedId });
    } catch (e) {
        next(e);
    }
};

module.exports = userController;
