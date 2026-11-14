const { ObjectId, toObjectId, isValidObjectId } = require("../utils/objectId");
const db = require("../config/connection");
const { hashPassword, comparePassword, generateOTP, signToken, generateResetToken, verifyResetToken } = require("../utils/crypto");
const { sendSuccess, sendError } = require("../utils/response");
const { sendOtpEmail } = require("../utils/mailer");
const path = require("path");
const fs = require("fs");

const adminController = {};

// Ensure upload directory exists
const uploadDir = path.resolve(__dirname, "../public/images");
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
        console.warn("Could not create images upload directory:", e.message);
    }
}

// Allowed image MIME types and extensions
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// 1. Admin Registration
adminController.AdminRegistration = async (req, res, next) => {
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

        // Check if admin email already exists
        const existingAdmin = await db.collection("Admin").findOne({ email: normalizedEmail });
        if (existingAdmin) {
            return sendError(res, 409, "An admin with this email already exists.");
        }

        const hashedPassword = hashPassword(password);
        const newAdmin = {
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            mobile: mobile ? mobile.trim() : "",
            address: address ? address.trim() : "",
            role: "admin",
            createdAt: new Date(),
        };

        const result = await db.collection("Admin").insertOne(newAdmin);
        return sendSuccess(res, 201, "Admin Registered Successfully", { id: result.insertedId });
    } catch (e) {
        next(e);
    }
};

// 2. View Admin Data (Strictly omitting passwords)
adminController.ViewAdminData = async (req, res, next) => {
    try {
        const result = await db
            .collection("Admin")
            .find({}, { projection: { password: 0 } })
            .toArray();

        return sendSuccess(res, 200, "Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 3. Delete Admin Data
adminController.DeleteAdmin = async (req, res, next) => {
    try {
        const id = req.params._id || req.params.id;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid Admin ID format.");
        }

        // Prevent admin from deleting their own account while logged in
        if (req.adminInfo && req.adminInfo.id === id) {
            return sendError(res, 400, "You cannot delete your own active admin account.");
        }

        // Prevent deleting the last remaining admin
        const totalAdmins = await db.collection("Admin").countDocuments();
        if (totalAdmins <= 1) {
            return sendError(res, 400, "Cannot delete the last remaining admin account.");
        }

        const result = await db.collection("Admin").deleteOne({ _id: objId });
        if (result.deletedCount === 0) {
            return sendError(res, 404, "Admin account not found.");
        }

        return sendSuccess(res, 200, "Data Deleted Successfully!!");
    } catch (e) {
        next(e);
    }
};

// 4. Admin Signin
adminController.AdminSignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendError(res, 400, "Please provide both email and password.");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const admin = await db.collection("Admin").findOne({ email: normalizedEmail });

        if (!admin) {
            return sendError(res, 401, "Invalid Email or Password!");
        }

        const { match, needsRehash } = comparePassword(password, admin.password);
        if (!match) {
            return sendError(res, 401, "Invalid Email or Password!");
        }

        // Automatically upgrade legacy plain-text password to salted hash
        if (needsRehash) {
            const upgradedHash = hashPassword(password);
            await db.collection("Admin").updateOne({ _id: admin._id }, { $set: { password: upgradedHash } });
        }

        const payload = {
            id: admin._id.toString(),
            email: admin.email,
            fullName: admin.fullName,
            role: "admin",
        };

        const token = signToken(payload, "24h");
        return sendSuccess(res, 200, "Admin SignIn Successfully!", { token }, { token });
    } catch (e) {
        next(e);
    }
};

// 5. Admin Change Password
adminController.AdminChangePassword = async (req, res, next) => {
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

        const adminId = toObjectId(req.adminInfo.id);
        const admin = await db.collection("Admin").findOne({ _id: adminId });
        if (!admin) {
            return sendError(res, 404, "Admin not found.");
        }

        const { match } = comparePassword(currentpassword, admin.password);
        if (!match) {
            return sendError(res, 400, "Current Password is Incorrect!");
        }

        const hashedPassword = hashPassword(newpassword);
        await db.collection("Admin").updateOne({ _id: adminId }, { $set: { password: hashedPassword } });

        return sendSuccess(res, 200, "Password Updated Successfully!");
    } catch (e) {
        next(e);
    }
};

// 6. Admin Forget Password (Generates secure OTP)
adminController.AdminForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return sendError(res, 400, "Email address is required.");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const admin = await db.collection("Admin").findOne({ email: normalizedEmail });

        if (!admin) {
            // Return specific message for frontend compatibility
            return sendError(res, 400, "Invalid Email Address!");
        }

        const otp = generateOTP();
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await db.collection("OTP").updateOne(
            { email: normalizedEmail, role: "admin" },
            {
                $set: {
                    otp: otp,
                    role: "admin",
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

// 7. Admin Verify OTP
adminController.AdminVerifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return sendError(res, 400, "Email and OTP are required.");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const otpDoc = await db.collection("OTP").findOne({ email: normalizedEmail, role: "admin" });

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

        // Mark OTP as verified and generate resetToken
        await db.collection("OTP").updateOne(
            { _id: otpDoc._id },
            { $set: { verified: true, verifiedAt: new Date() } }
        );

        const resetToken = generateResetToken(normalizedEmail, "admin");
        return sendSuccess(res, 200, "OTP is valid and Verified Successfully!", { resetToken }, { resetToken });
    } catch (e) {
        next(e);
    }
};

// 8. Admin Reset Password
adminController.AdminResetPassword = async (req, res, next) => {
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

        // Security check: Must have verified reset token or verified OTP record
        let isAuthorized = false;
        if (resetToken) {
            const tokenData = verifyResetToken(resetToken, "admin");
            if (tokenData && tokenData.email.toLowerCase() === normalizedEmail) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            const otpDoc = await db.collection("OTP").findOne({
                email: normalizedEmail,
                role: "admin",
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
        const result = await db.collection("Admin").updateOne(
            { email: normalizedEmail },
            { $set: { password: hashedPassword, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return sendError(res, 404, "Admin account not found.");
        }

        // Consume OTP record immediately to prevent replay
        await db.collection("OTP").deleteMany({ email: normalizedEmail, role: "admin" });

        return sendSuccess(res, 200, "Password reset Successfully!");
    } catch (e) {
        next(e);
    }
};

// 9. Add Category
adminController.AddCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName || !categoryName.trim()) {
            return sendError(res, 400, "Category Name is required.");
        }

        const cleanName = categoryName.trim();
        // Check for duplicate category name (case-insensitive)
        const existing = await db.collection("Category").findOne({
            categoryName: { $regex: new RegExp(`^${cleanName}$`, "i") }
        });
        if (existing) {
            return sendError(res, 409, "A category with this name already exists.");
        }

        const result = await db.collection("Category").insertOne({
            categoryName: cleanName,
            createdAt: new Date()
        });

        return sendSuccess(res, 201, "Category Added Successfully!!", { id: result.insertedId });
    } catch (e) {
        next(e);
    }
};

// 10. View Category
adminController.ViewCategory = async (req, res, next) => {
    try {
        const result = await db.collection("Category").find().sort({ categoryName: 1 }).toArray();
        return sendSuccess(res, 200, "Category Viewed Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 11. Delete Category (With cascade check)
adminController.DeleteCategory = async (req, res, next) => {
    try {
        const id = req.params._id || req.params.id;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid Category ID format.");
        }

        // Cascade protection: check if subcategories exist for this category
        const subCatCount = await db.collection("SubCategory").countDocuments({ categoryId: objId });
        if (subCatCount > 0) {
            return sendError(res, 400, `Cannot delete category: ${subCatCount} subcategories are linked to it. Delete subcategories first.`);
        }

        // Cascade protection: check if pets exist for this category
        const petCount = await db.collection("Pets").countDocuments({ petType: objId });
        if (petCount > 0) {
            return sendError(res, 400, `Cannot delete category: ${petCount} pets are assigned to this category.`);
        }

        const result = await db.collection("Category").deleteOne({ _id: objId });
        if (result.deletedCount === 0) {
            return sendError(res, 404, "Category not found.");
        }

        return sendSuccess(res, 200, "Category Deleted Successfully!!");
    } catch (e) {
        next(e);
    }
};

// 12. Add Sub-Category
adminController.AddSubCategory = async (req, res, next) => {
    try {
        const { subcategoryName, subcategorydescription, category } = req.body;
        if (!subcategoryName || !category) {
            return sendError(res, 400, "Subcategory Name and Parent Category are required.");
        }

        const categoryObjId = toObjectId(category);
        if (!categoryObjId) {
            return sendError(res, 400, "Invalid Category ID format.");
        }

        const categoryExists = await db.collection("Category").findOne({ _id: categoryObjId });
        if (!categoryExists) {
            return sendError(res, 404, "Parent Category not found.");
        }

        const cleanName = subcategoryName.trim();
        const existing = await db.collection("SubCategory").findOne({
            categoryId: categoryObjId,
            subcategory: { $regex: new RegExp(`^${cleanName}$`, "i") }
        });
        if (existing) {
            return sendError(res, 409, "This subcategory already exists under the selected category.");
        }

        const document = {
            subcategory: cleanName,
            subcategoryDescription: subcategorydescription ? subcategorydescription.trim() : "",
            categoryId: categoryObjId,
            createdAt: new Date()
        };

        const result = await db.collection("SubCategory").insertOne(document);
        return sendSuccess(res, 201, "Sub-Category Added Successfully!!", { id: result.insertedId });
    } catch (e) {
        next(e);
    }
};

// 13. View SubCategory
adminController.ViewSubCategory = async (req, res, next) => {
    try {
        const result = await db
            .collection("SubCategory")
            .aggregate([
                {
                    $lookup: {
                        from: "Category",
                        localField: "categoryId",
                        foreignField: "_id",
                        as: "categoryInfo",
                    },
                },
                {
                    $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true },
                },
                {
                    $project: {
                        _id: 1,
                        subcategory: 1,
                        categoryName: { $ifNull: ["$categoryInfo.categoryName", "Uncategorized"] },
                        subcategoryDescription: 1,
                        categoryId: 1
                    },
                },
            ])
            .toArray();

        return sendSuccess(res, 200, "Sub-Category Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 14. Delete SubCategory
adminController.DeleteSubCategory = async (req, res, next) => {
    try {
        const id = req.params.id || req.params._id;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid SubCategory ID format.");
        }

        // Cascade protection: check if pets are using this breed
        const petCount = await db.collection("Pets").countDocuments({ petBreed: objId });
        if (petCount > 0) {
            return sendError(res, 400, `Cannot delete subcategory: ${petCount} pets are assigned to this breed.`);
        }

        const result = await db.collection("SubCategory").deleteOne({ _id: objId });
        if (result.deletedCount === 0) {
            return sendError(res, 404, "SubCategory not found.");
        }

        return sendSuccess(res, 200, "Sub-Category Deleted Successfully!!");
    } catch (e) {
        next(e);
    }
};

// 15. Get Sub Category (Cascade dropdown)
adminController.GetSubCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const categoryObjId = toObjectId(id);
        if (!categoryObjId) {
            return sendError(res, 400, "Invalid Category ID format.");
        }

        const result = await db
            .collection("SubCategory")
            .find({ categoryId: categoryObjId })
            .sort({ subcategory: 1 })
            .toArray();

        return sendSuccess(res, 200, "Sub-Category Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 16. Add Pet
adminController.AddPet = async (req, res, next) => {
    try {
        const {
            category,
            subcategory,
            petName,
            petColor,
            petWeight,
            petGender,
            petAge,
            vaccinated,
            friendlyToOtherPets,
            childrenFriendly,
            aboutPet
        } = req.body;

        if (!category || !subcategory || !petName) {
            return sendError(res, 400, "Category, Subcategory, and Pet Name are required fields.");
        }

        const catId = toObjectId(category);
        const subCatId = toObjectId(subcategory);
        if (!catId || !subCatId) {
            return sendError(res, 400, "Invalid Category or Subcategory ID format.");
        }

        const document = {
            petType: catId,
            petBreed: subCatId,
            petName: petName.trim(),
            petcolor: petColor ? petColor.trim() : "",
            petWeight: petWeight || "",
            petGender: petGender || "Unknown",
            petAge: petAge || "",
            vaccinated: vaccinated || "No",
            friendlyToOtherPets: friendlyToOtherPets || "Yes",
            childrenFriendly: childrenFriendly || "Yes",
            isAvailable: "yes",
            petPhoto: "/assets/img/placeholder.png",
            aboutPet: aboutPet ? aboutPet.trim() : "",
            createdAt: new Date()
        };

        const result = await db.collection("Pets").insertOne(document);
        return sendSuccess(res, 201, "Pet Added Successfully!!", { id: result.insertedId });
    } catch (e) {
        next(e);
    }
};

// 17. View Pets
adminController.ViewPets = async (req, res, next) => {
    try {
        const result = await db
            .collection("Pets")
            .aggregate([
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
                        _id: 1,
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

        return sendSuccess(res, 200, "Pets Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 18. Delete Pet
adminController.DeletePet = async (req, res, next) => {
    try {
        const id = req.params.id || req.params._id;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid Pet ID format.");
        }

        const pet = await db.collection("Pets").findOne({ _id: objId });
        if (!pet) {
            return sendError(res, 404, "Pet not found.");
        }

        // Clean up pet gallery photos from DB
        await db.collection("PetsGallery").deleteMany({ petId: objId });

        const result = await db.collection("Pets").deleteOne({ _id: objId });
        return sendSuccess(res, 200, "Pet Deleted Successfully!", result);
    } catch (e) {
        next(e);
    }
};

// 19. Upload Pet Photo
adminController.UploadPetPhoto = async (req, res, next) => {
    try {
        if (!req.files || !req.files.photo) {
            return sendError(res, 400, "No photo file provided.");
        }

        const { petId } = req.body;
        const petObjId = toObjectId(petId);
        if (!petObjId) {
            return sendError(res, 400, "Invalid Pet ID format.");
        }

        const photo = req.files.photo;

        // Security: Validate file type and extension
        const ext = path.extname(photo.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(photo.mimetype)) {
            return sendError(res, 400, "Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.");
        }

        // Security: 5MB size limit
        if (photo.size > 5 * 1024 * 1024) {
            return sendError(res, 400, "File size exceeds 5MB limit.");
        }

        // Security: Sanitize filename to prevent path traversal
        const safeFileName = `pet-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const serverPath = path.join(uploadDir, safeFileName);
        const dbPath = "/images/" + safeFileName;

        photo.mv(serverPath, async (err) => {
            if (err) {
                return sendError(res, 500, "File save error: " + err.message);
            }

            const result = await db.collection("Pets").updateOne(
                { _id: petObjId },
                { $set: { petPhoto: dbPath } }
            );

            if (result.matchedCount === 0) {
                return sendError(res, 404, "Pet not found.");
            }

            return sendSuccess(res, 200, "Pet Photo Uploaded Successfully!", { petPhoto: dbPath });
        });
    } catch (e) {
        next(e);
    }
};

// 20. Upload photo to pet photo gallery
adminController.UploadPetPhotoGallery = async (req, res, next) => {
    try {
        if (!req.files || !req.files.photoGallery) {
            return sendError(res, 400, "No photo provided for gallery.");
        }

        const { petId } = req.body;
        const petObjId = toObjectId(petId);
        if (!petObjId) {
            return sendError(res, 400, "Invalid Pet ID format.");
        }

        const photoGallery = req.files.photoGallery;
        const ext = path.extname(photoGallery.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(photoGallery.mimetype)) {
            return sendError(res, 400, "Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.");
        }

        if (photoGallery.size > 5 * 1024 * 1024) {
            return sendError(res, 400, "File size exceeds 5MB limit.");
        }

        const safeFileName = `gallery-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const serverPath = path.join(uploadDir, safeFileName);
        const dbPath = "/images/" + safeFileName;

        photoGallery.mv(serverPath, async (err) => {
            if (err) {
                return sendError(res, 500, "File save error: " + err.message);
            }

            const result = await db.collection("PetsGallery").insertOne({
                petId: petObjId,
                petPhotoGallery: dbPath,
                createdAt: new Date()
            });

            return sendSuccess(res, 200, "Pet Photo Uploaded Successfully!", result);
        });
    } catch (e) {
        next(e);
    }
};

// 21. Pending requested data
adminController.PendingRequestData = async (req, res, next) => {
    try {
        const result = await db.collection("Adoption").find().sort({ createdAt: -1 }).toArray();
        return sendSuccess(res, 200, "Adoption Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 22. Confirm and Cancel adoption request
adminController.AcceptCancelAdoptionRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { adoptionStatus } = req.body;

        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid Adoption Request ID format.");
        }

        const validStatuses = ["Confirmed", "Cancelled", "Pending"];
        if (!validStatuses.includes(adoptionStatus)) {
            return sendError(res, 400, `Invalid adoption status. Allowed: ${validStatuses.join(", ")}`);
        }

        const adoptionRequest = await db.collection("Adoption").findOne({ _id: objId });
        if (!adoptionRequest) {
            return sendError(res, 404, "Adoption request data not found.");
        }

        await db.collection("Adoption").updateOne(
            { _id: objId },
            { $set: { adoptionStatus: adoptionStatus, updatedAt: new Date() } }
        );

        // Synchronize Pet availability
        const petId = adoptionRequest.petId;
        const petObjId = toObjectId(petId);
        if (petObjId) {
            let updatePetStatus = { $set: { isAvailable: "yes" } };
            if (adoptionStatus === "Confirmed") {
                updatePetStatus = { $set: { isAvailable: "Adopted" } };
            }
            await db.collection("Pets").updateOne({ _id: petObjId }, updatePetStatus);
        }

        return sendSuccess(res, 200, "Adoption Request Reviewed Successfully!!");
    } catch (e) {
        next(e);
    }
};

// 23. Delete Adoption Request
adminController.DeleteAdoptionRequest = async (req, res, next) => {
    try {
        const id = req.params._id || req.params.id;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid Adoption Request ID format.");
        }

        const result = await db.collection("Adoption").deleteOne({ _id: objId });
        if (result.deletedCount === 0) {
            return sendError(res, 404, "Adoption request not found.");
        }

        return sendSuccess(res, 200, "Request Deleted Successfully!!");
    } catch (e) {
        next(e);
    }
};

// 24. Showing pet details in modal
adminController.GetpetId = async (req, res, next) => {
    try {
        const objId = toObjectId(req.params.petId);
        if (!objId) {
            return sendError(res, 400, "Invalid Pet ID format.");
        }

        const pet = await db.collection("Pets").findOne({ _id: objId });
        if (!pet) {
            return sendError(res, 404, "Pet not found");
        }

        return sendSuccess(res, 200, "Pet retrieved successfully", pet, { pet });
    } catch (e) {
        next(e);
    }
};

// 25. Fetching Feedbacks with Aggregation
adminController.FetchFeedbacks = async (req, res, next) => {
    try {
        const feedbacks = await db
            .collection("Feedback")
            .aggregate([
                {
                    $lookup: {
                        from: "User",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: "Pets",
                        localField: "petId",
                        foreignField: "_id",
                        as: "petDetails",
                    },
                },
                {
                    $unwind: { path: "$petDetails", preserveNullAndEmptyArrays: true },
                },
                {
                    $project: {
                        _id: 1,
                        feedback: 1,
                        "userDetails.fullName": { $ifNull: ["$userDetails.fullName", "Anonymous"] },
                        "userDetails.email": { $ifNull: ["$userDetails.email", "N/A"] },
                        "userDetails.address": 1,
                        "userDetails.mobile": 1,
                        "petDetails.petPhoto": 1,
                        "petDetails.petName": { $ifNull: ["$petDetails.petName", "Unknown Pet"] },
                        "petDetails.petAge": 1,
                        "petDetails.petGender": 1,
                        "petDetails.petcolor": 1,
                    },
                },
            ])
            .toArray();

        return sendSuccess(res, 200, "Feedback Data Fetched Successfully!!", feedbacks, { feedbacks });
    } catch (e) {
        next(e);
    }
};

// 26. Fetch Homeless Pet Data
adminController.FetchHomelessPetData = async (req, res, next) => {
    try {
        const result = await db.collection("HomelessPets").find().sort({ createdAt: -1 }).toArray();
        return sendSuccess(res, 200, "Homeless Pets Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 27. Delete homeless pet data
adminController.DeleteHomelessPetData = async (req, res, next) => {
    try {
        const id = req.params.id || req.params._id;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid Report ID format.");
        }

        const result = await db.collection("HomelessPets").deleteOne({ _id: objId });
        if (result.deletedCount === 0) {
            return sendError(res, 404, "Report not found.");
        }

        return sendSuccess(res, 200, "Report Deleted Successfully");
    } catch (e) {
        next(e);
    }
};

// 28. View User Data (Passwords strictly excluded!)
adminController.ViewUserData = async (req, res, next) => {
    try {
        const result = await db
            .collection("User")
            .find({}, { projection: { password: 0 } })
            .toArray();

        return sendSuccess(res, 200, "Data Fetched Successfully!!", result);
    } catch (e) {
        next(e);
    }
};

// 29. Delete User Data
adminController.DeleteUser = async (req, res, next) => {
    try {
        const id = req.params._id || req.params.id;
        const objId = toObjectId(id);
        if (!objId) {
            return sendError(res, 400, "Invalid User ID format.");
        }

        const result = await db.collection("User").deleteOne({ _id: objId });
        if (result.deletedCount === 0) {
            return sendError(res, 404, "User not found.");
        }

        return sendSuccess(res, 200, "Data Deleted Successfully!!");
    } catch (e) {
        next(e);
    }
};

module.exports = adminController;
