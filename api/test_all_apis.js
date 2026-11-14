process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'Adopet_Test';
const http = require('http');
const app = require('./app');
const db = require('./config/connection');
const path = require('path');
const fs = require('fs');

const PORT = 5566;
let server;

function makeRequest({ path, method = 'GET', headers = {}, body = null }) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: '127.0.0.1',
            port: PORT,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = data;
                try { parsed = JSON.parse(data); } catch {}
                resolve({ status: res.statusCode, headers: res.headers, body: parsed });
            });
        });
        req.on('error', reject);
        if (body) {
            req.write(typeof body === 'string' ? body : JSON.stringify(body));
        }
        req.end();
    });
}

async function runAllApiTests() {
    console.log('====================================================');
    console.log('🚀 TESTING EVERY SINGLE API ENDPOINT END-TO-END');
    console.log('====================================================\n');

    server = app.listen(PORT);
    let passed = 0;
    let failed = 0;
    const failures = [];

    function test(name, condition, errorMsg = '') {
        if (condition) {
            console.log(`✅ [PASS] ${name}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${name} - ${errorMsg}`);
            failed++;
            failures.push({ name, errorMsg });
        }
    }

    try {
        // Wait briefly for mongo connection
        await new Promise(r => setTimeout(r, 1000));

        // 1. Health check
        const health = await makeRequest({ path: '/api/health' });
        test('GET /api/health', health.status === 200 && health.body.status === 'ok');

        // 2. Public Team
        const team = await makeRequest({ path: '/get-ourteam' });
        test('GET /get-ourteam', team.status === 200 && team.body.success === true);

        // 3. Public Contact Us
        const contact = await makeRequest({
            path: '/contact-us',
            method: 'POST',
            body: { name: 'John Doe', email: 'john@example.com', subject: 'Inquiry', message: 'Hello shelter!' }
        });
        test('POST /contact-us', contact.status === 201 && contact.body.success === true);

        // 4. Donations
        const createDonation = await makeRequest({
            path: '/create-donation',
            method: 'POST',
            body: { amount: 250, name: 'Alice Donor', email: 'alice@example.com', message: 'Keep up great work' }
        });
        test('POST /create-donation', createDonation.status === 201 && createDonation.body.order?.id);

        const verifyDonation = await makeRequest({
            path: '/verify-donation',
            method: 'POST',
            body: {
                razorpay_payment_id: 'pay_test_9999',
                razorpay_order_id: createDonation.body.order?.id,
                razorpay_signature: 'sig_test'
            }
        });
        test('POST /verify-donation', verifyDonation.status === 200 && verifyDonation.body.success === true);

        // 5. Admin Registration & Signin
        // If an admin already exists, use existing admin credentials to authorize registration
        const existingAdmin = await db.collection('Admin').findOne({});
        let bootstrapHeaders = {};
        if (existingAdmin) {
            const seedToken = require('./utils/crypto').signToken({
                id: existingAdmin._id.toString(),
                email: existingAdmin.email,
                fullName: existingAdmin.fullName,
                role: 'admin'
            });
            bootstrapHeaders = { 'Authorization': `Bearer ${seedToken}` };
        }

        const adminEmail = `admin_${Date.now()}@test.com`;
        const adminReg = await makeRequest({
            path: '/admin-registration',
            method: 'POST',
            headers: bootstrapHeaders,
            body: {
                fullName: 'Super Admin',
                email: adminEmail,
                password: 'AdminPassword123!',
                mobile: '9876543210',
                address: 'Main Shelter HQ'
            }
        });
        test('POST /admin-registration', adminReg.status === 201 && adminReg.body.success === true);

        const adminLogin = await makeRequest({
            path: '/admin-signin',
            method: 'POST',
            body: { email: adminEmail, password: 'AdminPassword123!' }
        });
        test('POST /admin-signin', adminLogin.status === 200 && adminLogin.body.token);
        const adminToken = adminLogin.body.token;
        const adminHeaders = { 'Authorization': `Bearer ${adminToken}` };

        // 6. View Admin List (Admin only)
        const viewAdmin = await makeRequest({ path: '/admin-registration', headers: adminHeaders });
        test('GET /admin-registration', viewAdmin.status === 200 && Array.isArray(viewAdmin.body.data || viewAdmin.body.result));

        // 7. Admin Change Password
        const adminChangePw = await makeRequest({
            path: '/admin-changepassword',
            method: 'POST',
            headers: adminHeaders,
            body: {
                currentpassword: 'AdminPassword123!',
                newpassword: 'NewAdminPassword456!',
                confirmpassword: 'NewAdminPassword456!'
            }
        });
        test('POST /admin-changepassword', adminChangePw.status === 200 && adminChangePw.body.success === true);

        // 8. Admin Forget Password & OTP
        const adminForgot = await makeRequest({
            path: '/admin-forgetpassword',
            method: 'POST',
            body: { email: adminEmail }
        });
        test('POST /admin-forgetpassword', adminForgot.status === 200 && adminForgot.body.success === true);

        // Retrieve generated OTP from DB for testing verification
        const otpRecord = await db.collection('OTP').findOne({ email: adminEmail, role: 'admin' });
        test('Admin OTP Stored in DB', !!otpRecord && !!otpRecord.otp);

        const adminVerifyOtp = await makeRequest({
            path: '/admin-verify-otp',
            method: 'POST',
            body: { email: adminEmail, otp: otpRecord?.otp }
        });
        test('POST /admin-verify-otp', adminVerifyOtp.status === 200 && adminVerifyOtp.body.resetToken);

        const adminReset = await makeRequest({
            path: '/admin-reset-password',
            method: 'POST',
            body: {
                email: adminEmail,
                newpassword: 'FinalAdminPassword789!',
                confirmpassword: 'FinalAdminPassword789!',
                resetToken: adminVerifyOtp.body.resetToken
            }
        });
        test('POST /admin-reset-password', adminReset.status === 200 && adminReset.body.success === true);

        // Re-login with new password
        const adminReLogin = await makeRequest({
            path: '/admin-signin',
            method: 'POST',
            body: { email: adminEmail, password: 'FinalAdminPassword789!' }
        });
        const activeAdminHeaders = { 'Authorization': `Bearer ${adminReLogin.body.token}` };

        // 9. User Registration & Signin
        const userEmail = `user_${Date.now()}@test.com`;
        const userReg = await makeRequest({
            path: '/user-registration',
            method: 'POST',
            body: {
                fullName: 'Happy Adopter',
                email: userEmail,
                password: 'UserPassword123!',
                mobile: '9123456780',
                address: '123 Green Valley St'
            }
        });
        test('POST /user-registration', userReg.status === 201 && userReg.body.success === true);

        const userLogin = await makeRequest({
            path: '/user-signin',
            method: 'POST',
            body: { email: userEmail, password: 'UserPassword123!' }
        });
        test('POST /user-signin', userLogin.status === 200 && userLogin.body.token);
        const userToken = userLogin.body.token;
        const userHeaders = { 'Authorization': `Bearer ${userToken}` };

        // 10. User Profile
        const userProfile = await makeRequest({ path: '/getUserDetails', headers: userHeaders });
        test('GET /getUserDetails', userProfile.status === 200 && userProfile.body.result?.[0]?.email === userEmail);

        // 11. User Change Password
        const userChangePw = await makeRequest({
            path: '/user-changepassword',
            method: 'POST',
            headers: userHeaders,
            body: {
                currentpassword: 'UserPassword123!',
                newpassword: 'NewUserPassword456!',
                confirmpassword: 'NewUserPassword456!'
            }
        });
        test('POST /user-changepassword', userChangePw.status === 200 && userChangePw.body.success === true);

        // 12. User Forget Password & OTP
        const userForgot = await makeRequest({
            path: '/user-forgetpassword',
            method: 'POST',
            body: { email: userEmail }
        });
        test('POST /user-forgetpassword', userForgot.status === 200 && userForgot.body.success === true);

        const userOtpRecord = await db.collection('OTP').findOne({ email: userEmail, role: 'user' });
        const userVerifyOtp = await makeRequest({
            path: '/user-verify-otp',
            method: 'POST',
            body: { email: userEmail, otp: userOtpRecord?.otp }
        });
        test('POST /user-verify-otp', userVerifyOtp.status === 200 && userVerifyOtp.body.resetToken);

        const userReset = await makeRequest({
            path: '/user-reset-password',
            method: 'POST',
            body: {
                email: userEmail,
                newpassword: 'FinalUserPassword789!',
                confirmpassword: 'FinalUserPassword789!',
                resetToken: userVerifyOtp.body.resetToken
            }
        });
        test('POST /user-reset-password', userReset.status === 200 && userReset.body.success === true);

        // 13. Category Management (Admin)
        const addCat = await makeRequest({
            path: '/manage-category',
            method: 'POST',
            headers: activeAdminHeaders,
            body: { categoryName: 'Dogs' }
        });
        test('POST /manage-category', addCat.status === 201 && addCat.body.success === true);
        const categoryId = addCat.body.data?.id || addCat.body.result?.id;

        const viewCat = await makeRequest({ path: '/manage-category', headers: activeAdminHeaders });
        test('GET /manage-category', viewCat.status === 200 && Array.isArray(viewCat.body.result));

        // 14. Subcategory Management (Admin)
        const addSubCat = await makeRequest({
            path: '/manage-subcategory',
            method: 'POST',
            headers: activeAdminHeaders,
            body: {
                subcategoryName: 'Golden Retriever',
                subcategorydescription: 'Friendly, intelligent, and devoted.',
                category: categoryId
            }
        });
        test('POST /manage-subcategory', addSubCat.status === 201 && addSubCat.body.success === true);
        const subCategoryId = addSubCat.body.data?.id || addSubCat.body.result?.id;

        const viewSubCat = await makeRequest({ path: '/manage-subcategory', headers: activeAdminHeaders });
        test('GET /manage-subcategory', viewSubCat.status === 200 && Array.isArray(viewSubCat.body.result));

        const getSubByCat = await makeRequest({ path: `/manage-subcategory/${categoryId}` });
        test('GET /manage-subcategory/:id (Cascade dropdown)', getSubByCat.status === 200 && getSubByCat.body.result?.length > 0);

        // 15. Pet Management
        const addPet = await makeRequest({
            path: '/manage-pets',
            method: 'POST',
            headers: activeAdminHeaders,
            body: {
                category: categoryId,
                subcategory: subCategoryId,
                petName: 'Buddy',
                petColor: 'Golden',
                petWeight: '25kg',
                petGender: 'Male',
                petAge: '2 Years',
                vaccinated: 'Yes',
                friendlyToOtherPets: 'Yes',
                childrenFriendly: 'Yes',
                aboutPet: 'Loves playing fetch and very playful.'
            }
        });
        test('POST /manage-pets', addPet.status === 201 && addPet.body.success === true);
        const petId = addPet.body.data?.id || addPet.body.result?.id;

        const viewPets = await makeRequest({ path: '/manage-pets' });
        test('GET /manage-pets', viewPets.status === 200 && viewPets.body.result?.length > 0);

        const getPet = await makeRequest({ path: `/pets/${petId}` });
        test('GET /pets/:petId', getPet.status === 200 && getPet.body.pet?._id);

        const adoptPetView = await makeRequest({ path: `/adopt-pets/${petId}`, headers: userHeaders });
        test('GET /adopt-pets/:id', adoptPetView.status === 200 && adoptPetView.body.result?.length > 0);

        // 16. Photo Uploads (Multipart image)
        const boundary = '----TestBoundary12345';
        const imageBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]); // Minimal JPEG header
        const multipartBody = Buffer.concat([
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="petId"\r\n\r\n${petId}\r\n`),
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="buddy.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
            imageBuffer,
            Buffer.from(`\r\n--${boundary}--\r\n`)
        ]);

        const uploadPhoto = await new Promise((resolve) => {
            const req = http.request({
                hostname: '127.0.0.1',
                port: PORT,
                path: '/manage-pet-photo',
                method: 'POST',
                headers: {
                    ...activeAdminHeaders,
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': multipartBody.length
                }
            }, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d || '{}') }));
            });
            req.write(multipartBody);
            req.end();
        });
        test('POST /manage-pet-photo', uploadPhoto.status === 200 && uploadPhoto.body.success === true);

        // Upload to pet gallery
        const galleryMultipartBody = Buffer.concat([
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="petId"\r\n\r\n${petId}\r\n`),
            Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photoGallery"; filename="gallery1.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`),
            imageBuffer,
            Buffer.from(`\r\n--${boundary}--\r\n`)
        ]);

        const uploadGallery = await new Promise((resolve) => {
            const req = http.request({
                hostname: '127.0.0.1',
                port: PORT,
                path: '/manage-pet-photoGallery',
                method: 'POST',
                headers: {
                    ...activeAdminHeaders,
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': galleryMultipartBody.length
                }
            }, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d || '{}') }));
            });
            req.write(galleryMultipartBody);
            req.end();
        });
        test('POST /manage-pet-photoGallery', uploadGallery.status === 200 && uploadGallery.body.success === true);

        const getGallery = await makeRequest({ path: `/GetPetsGallery/${petId}`, headers: userHeaders });
        test('GET /GetPetsGallery/:id', getGallery.status === 200 && getGallery.body.result?.length > 0);

        const getAllGallery = await makeRequest({ path: '/AllPetGalleryData', headers: userHeaders });
        test('GET /AllPetGalleryData', getAllGallery.status === 200 && getAllGallery.body.result?.length > 0);

        // 17. Adoption Flow
        const adoptRequest = await makeRequest({
            path: '/mainAdoption-pet',
            method: 'POST',
            headers: userHeaders,
            body: {
                petId: petId,
                fullName: 'Happy Adopter',
                email: userEmail,
                mobile: '9123456780',
                address: '123 Green Valley St',
                reason: 'We want to give Buddy a loving forever home.',
                occupation: 'Software Engineer',
                residenceType: 'Independent House'
            }
        });
        test('POST /mainAdoption-pet', adoptRequest.status === 201 && adoptRequest.body.success === true);

        const userAdoptions = await makeRequest({ path: '/adoption-pets-request', headers: userHeaders });
        test('GET /adoption-pets-request', userAdoptions.status === 200 && userAdoptions.body.result?.length > 0);
        const adoptionId = userAdoptions.body.result?.[0]?._id;

        const adminAdoptions = await makeRequest({ path: '/adoption-pets', headers: activeAdminHeaders });
        test('GET /adoption-pets', adminAdoptions.status === 200 && adminAdoptions.body.result?.length > 0);

        // Confirm adoption (Check pet becomes Adopted)
        const confirmAdoption = await makeRequest({
            path: `/adoption-pets/${adoptionId}`,
            method: 'PUT',
            headers: activeAdminHeaders,
            body: { adoptionStatus: 'Confirmed' }
        });
        test('PUT /adoption-pets/:id (Confirm)', confirmAdoption.status === 200 && confirmAdoption.body.success === true);

        const updatedPet = await db.collection('Pets').findOne({ _id: db.collection('Pets').findOne ? new (require('mongodb').ObjectId)(petId) : null });
        test('Pet availability status auto-synced to "Adopted"', updatedPet?.isAvailable === 'Adopted');

        // Cancel adoption (Check pet returns to available 'yes')
        const cancelAdoption = await makeRequest({
            path: `/adoption-pets/${adoptionId}`,
            method: 'PUT',
            headers: activeAdminHeaders,
            body: { adoptionStatus: 'Cancelled' }
        });
        test('PUT /adoption-pets/:id (Cancel)', cancelAdoption.status === 200 && cancelAdoption.body.success === true);
        const resetPet = await db.collection('Pets').findOne({ _id: new (require('mongodb').ObjectId)(petId) });
        test('Pet availability status auto-reset to "yes"', resetPet?.isAvailable === 'yes');

        // 18. Feedback Submission & Retrieval
        const addFeedback = await makeRequest({
            path: '/feedback',
            method: 'POST',
            headers: userHeaders,
            body: {
                petId: petId,
                feedback: 'Buddy is the most wonderful dog! Thank you so much.'
            }
        });
        test('POST /feedback', addFeedback.status === 201 && addFeedback.body.success === true);

        const viewFeedbacks = await makeRequest({ path: '/fetch-feedbacks', headers: activeAdminHeaders });
        test('GET /fetch-feedbacks', viewFeedbacks.status === 200 && viewFeedbacks.body.feedbacks?.length > 0);

        // 19. Homeless Pet Reporting & Retrieval
        const reportPet = await makeRequest({
            path: '/reportfound-pet',
            method: 'POST',
            headers: userHeaders,
            body: {
                petType: 'Stray Dog',
                petColor: 'Brown',
                location: 'Near Central Park Gate 2',
                description: 'Friendly dog with a slight limp on left paw.',
                reporterName: 'Concerned Citizen',
                reporterPhone: '9888877777'
            }
        });
        test('POST /reportfound-pet', reportPet.status === 201 && reportPet.body.success === true);

        const viewHomeless = await makeRequest({ path: '/getHomelessPets-data', headers: activeAdminHeaders });
        test('GET /getHomelessPets-data', viewHomeless.status === 200 && viewHomeless.body.result?.length > 0);
        const homelessId = viewHomeless.body.result?.[0]?._id;

        // 20. Users List & User Cleanup
        const viewUsers = await makeRequest({ path: '/view-users', headers: activeAdminHeaders });
        test('GET /view-users', viewUsers.status === 200 && viewUsers.body.result?.length > 0);
        const targetUserId = viewUsers.body.result?.[0]?._id;

        // 21. Deletion Endpoints
        const delHomeless = await makeRequest({
            path: `/getHomelessPets-data/${homelessId}`,
            method: 'DELETE',
            headers: activeAdminHeaders
        });
        test('DELETE /getHomelessPets-data/:id', delHomeless.status === 200 && delHomeless.body.success === true);

        const delAdoption = await makeRequest({
            path: `/adoption-pets/${adoptionId}`,
            method: 'DELETE',
            headers: activeAdminHeaders
        });
        test('DELETE /adoption-pets/:id', delAdoption.status === 200 && delAdoption.body.success === true);

        // Cascade protection test: Category cannot be deleted while subcategory / pet exists
        const blockedCatDelete = await makeRequest({
            path: `/manage-category/${categoryId}`,
            method: 'DELETE',
            headers: activeAdminHeaders
        });
        test('DELETE /manage-category/:id blocked by cascade protection', blockedCatDelete.status === 400);

        // Delete Pet
        const delPet = await makeRequest({
            path: `/manage-pets/${petId}`,
            method: 'DELETE',
            headers: activeAdminHeaders
        });
        test('DELETE /manage-pets/:id', delPet.status === 200 && delPet.body.success === true);

        // Delete SubCategory
        const delSubCat = await makeRequest({
            path: `/manage-subcategory/${subCategoryId}`,
            method: 'DELETE',
            headers: activeAdminHeaders
        });
        test('DELETE /manage-subcategory/:id', delSubCat.status === 200 && delSubCat.body.success === true);

        // Now Category can be deleted cleanly
        const delCat = await makeRequest({
            path: `/manage-category/${categoryId}`,
            method: 'DELETE',
            headers: activeAdminHeaders
        });
        test('DELETE /manage-category/:id', delCat.status === 200 && delCat.body.success === true);

        // Delete User
        const delUser = await makeRequest({
            path: `/view-users/${targetUserId}`,
            method: 'DELETE',
            headers: activeAdminHeaders
        });
        test('DELETE /view-users/:id', delUser.status === 200 && delUser.body.success === true);

        console.log('\n====================================================');
        console.log(`📊 TOTAL ENDPOINTS TESTED: ${passed + failed}`);
        console.log(`   Passed: ${passed}`);
        console.log(`   Failed: ${failed}`);
        console.log('====================================================\n');

        if (failed > 0) {
            console.error('FAILURES SUMMARY:');
            failures.forEach(f => console.error(` - ${f.name}: ${f.errorMsg}`));
        }

    } catch (e) {
        console.error('Test execution fatal error:', e);
    } finally {
        server.close();
        process.exit(failed > 0 ? 1 : 0);
    }
}

runAllApiTests();
