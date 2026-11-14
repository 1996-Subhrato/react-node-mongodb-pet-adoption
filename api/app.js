const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

// Load environment variables
require('./utils/env');

const db = require("./config/connection");
const adminController = require('./controllers/adminController');
const userController = require('./controllers/userControlller');
const indexController = require('./controllers/indexController');
const donationController = require('./controllers/donationController');

// Middlewares
const { adminAuthMiddleware, userAuthMiddleware, optionalAuth } = require('./middlewares/AuthMiddleware');
const { authLimiter, otpLimiter, contactLimiter } = require('./middlewares/rateLimiter');
const securityHeaders = require('./middlewares/securityHeaders');
const errorHandler = require('./middlewares/errorHandler');
const { sendError } = require('./utils/response');

const app = express();

// Global Middlewares
app.use(securityHeaders);
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    abortOnLimit: true,
    useTempFiles: false,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------------------------------------------------------------
// PUBLIC & GUEST ROUTES
// -----------------------------------------------------------------------------
app.get('/get-ourteam', indexController.ViewOurTeam);
app.post('/contact-us', contactLimiter, indexController.ContactUs);

// User Auth Routes
app.post('/user-signin', authLimiter, userController.UserSignIn);
app.post('/user-registration', authLimiter, userController.UserRegistration);
app.post('/user-forgetpassword', otpLimiter, userController.UserForgetPassword);
app.post('/user-verify-otp', authLimiter, userController.UserVerifyOtp);
app.post('/user-reset-password', authLimiter, userController.UserResetPassword);

// Admin Auth Routes
app.post('/admin-signin', authLimiter, adminController.AdminSignIn);
app.post('/admin-forgetpassword', otpLimiter, adminController.AdminForgetPassword);
app.post('/admin-verify-otp', authLimiter, adminController.AdminVerifyOtp);
app.post('/admin-reset-password', authLimiter, adminController.AdminResetPassword);

// Donation Routes (Open / User)
app.post('/create-donation', optionalAuth, donationController.CreateDonation);
app.post('/verify-donation', optionalAuth, donationController.VerifyDonation);

// -----------------------------------------------------------------------------
// SHARED RESOURCE ROUTES (User or Admin can view)
// -----------------------------------------------------------------------------
// View pets: accessible by users, admins, or guest visitors for browsing
app.get('/manage-pets', optionalAuth, adminController.ViewPets);
// View specific pet: used by both user dashboard and admin pending requests
app.get('/pets/:petId', optionalAuth, adminController.GetpetId);
// Subcategory cascade lookup
app.get('/manage-subcategory/:id', optionalAuth, adminController.GetSubCategory);

// -----------------------------------------------------------------------------
// ADMIN PROTECTED ROUTES (Strict role: admin required)
// -----------------------------------------------------------------------------
// Middleware to allow initial admin setup on fresh databases, otherwise enforces admin auth
async function adminRegistrationGuard(req, res, next) {
    try {
        const totalAdmins = await db.collection("Admin").countDocuments();
        if (totalAdmins === 0) {
            return next();
        }
    } catch {}
    return adminAuthMiddleware(req, res, next);
}

app.post('/admin-registration', adminRegistrationGuard, adminController.AdminRegistration);
app.get('/admin-registration', adminAuthMiddleware, adminController.ViewAdminData);
app.delete('/admin-registration/:_id', adminAuthMiddleware, adminController.DeleteAdmin);
app.post('/admin-changepassword', adminAuthMiddleware, adminController.AdminChangePassword);

// Category Management
app.post('/manage-category', adminAuthMiddleware, adminController.AddCategory);
app.get('/manage-category', adminAuthMiddleware, adminController.ViewCategory);
app.delete('/manage-category/:_id', adminAuthMiddleware, adminController.DeleteCategory);
app.delete('/manage-category/:id', adminAuthMiddleware, adminController.DeleteCategory);

// Subcategory Management
app.post('/manage-subcategory', adminAuthMiddleware, adminController.AddSubCategory);
app.get('/manage-subcategory', adminAuthMiddleware, adminController.ViewSubCategory);
app.delete('/manage-subcategory/:id', adminAuthMiddleware, adminController.DeleteSubCategory);

// Pet Management (Admin mutation)
app.post('/manage-pets', adminAuthMiddleware, adminController.AddPet);
app.delete('/manage-pets/:id', adminAuthMiddleware, adminController.DeletePet);
app.post('/manage-pet-photo', adminAuthMiddleware, adminController.UploadPetPhoto);
app.post('/manage-pet-photoGallery', adminAuthMiddleware, adminController.UploadPetPhotoGallery);

// Adoption Requests (Admin management)
app.get('/adoption-pets', adminAuthMiddleware, adminController.PendingRequestData);
app.put('/adoption-pets/:id', adminAuthMiddleware, adminController.AcceptCancelAdoptionRequest);
app.delete('/adoption-pets/:_id', adminAuthMiddleware, adminController.DeleteAdoptionRequest);
app.delete('/adoption-pets/:id', adminAuthMiddleware, adminController.DeleteAdoptionRequest);

// Feedback & Homeless Pets & Users
app.get('/fetch-feedbacks', adminAuthMiddleware, adminController.FetchFeedbacks);
app.get('/getHomelessPets-data', adminAuthMiddleware, adminController.FetchHomelessPetData);
app.delete('/getHomelessPets-data/:id', adminAuthMiddleware, adminController.DeleteHomelessPetData);
app.get('/view-users', adminAuthMiddleware, adminController.ViewUserData);
app.delete('/view-users/:_id', adminAuthMiddleware, adminController.DeleteUser);
app.delete('/view-users/:id', adminAuthMiddleware, adminController.DeleteUser);

// -----------------------------------------------------------------------------
// USER PROTECTED ROUTES (User or Admin account required)
// -----------------------------------------------------------------------------
app.post('/user-changepassword', userAuthMiddleware, userController.UserChangePassword);
app.get('/adopt-pets/:id', userAuthMiddleware, userController.AdoptPets);
app.post('/mainAdoption-pet', userAuthMiddleware, userController.MainAdoptPets);
app.get('/GetPetsGallery/:id', userAuthMiddleware, userController.GetGalleryData);
app.get('/getUserDetails', userAuthMiddleware, userController.GetUserData);
app.get('/adoption-pets-request', userAuthMiddleware, userController.UserPendingRequestData);
app.post('/feedback', userAuthMiddleware, userController.UserFeedback);
app.get('/AllPetGalleryData', userAuthMiddleware, userController.GetAllPetGalleryData);
app.post('/reportfound-pet', userAuthMiddleware, userController.ReportFoundPet);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// 404 Handler for undefined routes
app.use((req, res) => {
    return sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found.`);
});

// Centralized Global Error Handler
app.use(errorHandler);

const port = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${port}`);
    });
}

module.exports = app;
