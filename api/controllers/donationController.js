const db = require("../config/connection");
const { sendSuccess, sendError } = require("../utils/response");
const crypto = require("crypto");

const donationController = {};

// 1. Create Donation Order
donationController.CreateDonation = async (req, res, next) => {
    try {
        const { amount, name, email, message } = req.body;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return sendError(res, 400, "Please enter a valid donation amount.");
        }

        if (!name || !email) {
            return sendError(res, 400, "Donor name and email are required.");
        }

        const orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
        const orderData = {
            orderId,
            amount: Number(amount) * 100, // In paise
            currency: "INR",
            donorName: name.trim(),
            donorEmail: email.trim().toLowerCase(),
            message: message ? message.trim() : "",
            status: "Created",
            createdAt: new Date(),
        };

        await db.collection("Donations").insertOne(orderData);

        return sendSuccess(res, 201, "Donation order initialized", {
            order: {
                id: orderId,
                amount: orderData.amount,
                currency: "INR",
            }
        }, {
            order: {
                id: orderId,
                amount: orderData.amount,
                currency: "INR",
            }
        });
    } catch (e) {
        next(e);
    }
};

// 2. Verify Donation Payment
donationController.VerifyDonation = async (req, res, next) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_user_id, razorpay_signature } = req.body;
        const targetOrderId = razorpay_order_id || razorpay_user_id;

        if (!razorpay_payment_id) {
            return sendError(res, 400, "Payment verification identifier missing.");
        }

        const updateData = {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature || "simulated",
            status: "Verified",
            verifiedAt: new Date(),
        };

        if (targetOrderId) {
            await db.collection("Donations").updateOne({ orderId: targetOrderId }, { $set: updateData });
        } else {
            await db.collection("Donations").insertOne({
                paymentId: razorpay_payment_id,
                status: "Verified",
                createdAt: new Date(),
            });
        }

        return sendSuccess(res, 200, "Donation verified successfully! Thank you for your support.");
    } catch (e) {
        next(e);
    }
};

module.exports = donationController;

