const db = require("../config/connection");
const { sendSuccess, sendError } = require("../utils/response");

const indexController = {};

// 1. Contact Us (With input validation and awaited insertion)
indexController.ContactUs = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return sendError(res, 400, "Name, Email, and Message are required.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 400, "Please provide a valid email address.");
        }

        const contactData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject ? subject.trim() : "General Inquiry",
            message: message.trim(),
            createdAt: new Date()
        };

        const result = await db.collection("ContactUs").insertOne(contactData);
        return sendSuccess(res, 201, "Message Sent Successfully!!", { id: result.insertedId });
    } catch (e) {
        next(e);
    }
};

// 2. View Our Team (CRITICAL SECURITY FIX: Never expose Admin passwords, emails, or credentials!)
indexController.ViewOurTeam = async (req, res, next) => {
    try {
        const collection = "Admin";
        // Strictly project only public, non-sensitive fields (inclusion projection)
        const result = await db
            .collection(collection)
            .find({}, {
                projection: {
                    fullName: 1,
                    role: 1,
                    _id: 1,
                }
            })
            .toArray();

        // Format team member representation
        const teamMembers = result.map((admin, index) => ({
            _id: admin._id,
            fullName: admin.fullName,
            designation: index === 0 ? "Executive Director" : "Adoption Specialist & Caregiver",
            avatar: `/assets/images/team-${(index % 4) + 1}.jpg`
        }));

        return sendSuccess(res, 200, "Team Data Fetches Successfully!!", teamMembers);
    } catch (e) {
        next(e);
    }
};

module.exports = indexController;
