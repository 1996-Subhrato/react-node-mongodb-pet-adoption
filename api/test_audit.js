process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('./app');
const { hashPassword, comparePassword, signToken, generateOTP } = require('./utils/crypto');
const { toObjectId, isValidObjectId } = require('./utils/objectId');

let server;
const PORT = 5555;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runTests() {
    console.log('====================================================');
    console.log('🛡️  STARTING PRODUCTION-GRADE AUDIT & PENETRATION SUITE');
    console.log('====================================================\n');

    let passedCount = 0;
    let failedCount = 0;

    function assert(condition, testName, details = '') {
        if (condition) {
            console.log(`✅ [PASS] ${testName}`);
            passedCount++;
        } else {
            console.error(`❌ [FAIL] ${testName} - ${details}`);
            failedCount++;
        }
    }

    server = app.listen(PORT);

    const makeRequest = (options, postData = null) => {
        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = data ? JSON.parse(data) : {};
                        resolve({ status: res.statusCode, headers: res.headers, body: json });
                    } catch (e) {
                        resolve({ status: res.statusCode, headers: res.headers, body: data });
                    }
                });
            });
            req.on('error', reject);
            if (postData) {
                req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
            }
            req.end();
        });
    };

    try {
        // TEST 1: Password Hashing & Salt Verification
        console.log('--- TEST 1: Cryptographic Password Security ---');
        const plain = 'SecretPass123!';
        const hash = hashPassword(plain);
        assert(hash.startsWith('scrypt$'), 'Hash uses secure scrypt with salt');
        assert(hash !== plain, 'Password is never stored in plain text');
        const verification = comparePassword(plain, hash);
        assert(verification.match === true, 'comparePassword verifies correct password');
        const wrongVerification = comparePassword('WrongPass', hash);
        assert(wrongVerification.match === false, 'comparePassword rejects incorrect password');

        // TEST 2: ObjectId Crash Resistance
        console.log('\n--- TEST 2: NoSQL / ObjectId Injection & Crash Resistance ---');
        assert(isValidObjectId('not-an-id') === false, 'isValidObjectId rejects invalid string');
        assert(isValidObjectId('507f1f77bcf86cd799439011') === true, 'isValidObjectId accepts valid 24-hex string');
        assert(toObjectId('invalid') === null, 'toObjectId safely returns null on malformed input');

        const badIdRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/pets/invalid-id-should-not-crash',
            method: 'GET'
        });
        assert(badIdRes.status === 400, 'Invalid pet ID returns 400 Bad Request without server crash', `Got ${badIdRes.status}`);

        // TEST 3: Sensitive Data Leak Prevention on GET /get-ourteam
        console.log('\n--- TEST 3: Sensitive Credential Exposure Defense ---');
        const teamRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/get-ourteam',
            method: 'GET'
        });
        assert(teamRes.status === 200, 'Public /get-ourteam endpoint responds 200 OK');
        const teamData = teamRes.body.data || teamRes.body.result || [];
        let leaked = false;
        if (Array.isArray(teamData)) {
            for (const member of teamData) {
                if (member.password || member.email || member.mobile) leaked = true;
            }
        }
        assert(!leaked, 'Admin passwords, emails, and phone numbers are completely redacted from public endpoint');

        // TEST 4: Privilege Escalation Attack Defense
        console.log('\n--- TEST 4: Privilege Escalation Defense (User -> Admin) ---');
        const fakeUserToken = signToken({
            id: '507f1f77bcf86cd799439011',
            email: 'attacker@user.com',
            fullName: 'Malicious User',
            role: 'user' // Normal user role
        });

        const adminRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/manage-category',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${fakeUserToken}`,
                'Content-Type': 'application/json'
            }
        }, { categoryName: 'Hacked Category' });
        assert(adminRes.status === 403, 'Normal user token CANNOT perform admin actions (403 Forbidden)', `Got status ${adminRes.status}`);

        // TEST 5: Missing / Malformed Authorization Defense
        console.log('\n--- TEST 5: Unauthorized Access Defense ---');
        const noAuthRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/admin-registration',
            method: 'GET'
        });
        assert(noAuthRes.status === 401, 'Request with missing token is rejected with 401 Unauthorized', `Got ${noAuthRes.status}`);

        const badAuthRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/admin-registration',
            method: 'GET',
            headers: { 'Authorization': 'NotBearer token123' }
        });
        assert(badAuthRes.status === 401, 'Malformed authorization header is rejected with 401 Unauthorized');

        // TEST 6: Unauthenticated Password Reset (OTP Bypass) Defense
        console.log('\n--- TEST 6: Password Reset Security (OTP Bypass Defense) ---');
        const bypassAttempt = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/user-reset-password',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            email: 'victim@example.com',
            newpassword: 'NewHackedPassword123!',
            confirmpassword: 'NewHackedPassword123!'
        });
        assert(bypassAttempt.status === 403, 'Direct password reset without verified OTP is blocked with 403 Forbidden', `Got ${bypassAttempt.status}`);

        // TEST 7: Security Headers Check
        console.log('\n--- TEST 7: Security Response Headers ---');
        const healthRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/api/health',
            method: 'GET'
        });
        assert(healthRes.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff header present');
        assert(healthRes.headers['x-frame-options'] === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN header present');
        assert(healthRes.headers['x-xss-protection'] === '1; mode=block', 'X-XSS-Protection header present');

        // TEST 8: Donation Endpoints Test
        console.log('\n--- TEST 8: Donation System Endpoints ---');
        const donationRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/create-donation',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            amount: 500,
            name: 'Kind Donor',
            email: 'donor@example.com',
            message: 'For animal food'
        });
        assert(donationRes.status === 201, 'Donation creation succeeds with 201 Created', `Got ${donationRes.status}`);
        assert(donationRes.body.order && donationRes.body.order.id, 'Donation order ID generated');

        const verifyDonationRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/verify-donation',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            razorpay_payment_id: 'pay_test_12345',
            razorpay_order_id: donationRes.body.order?.id
        });
        assert(verifyDonationRes.status === 200, 'Donation verification succeeds with 200 OK');

        // TEST 9: Contact Us Form Validation & XSS/Payload Test
        console.log('\n--- TEST 9: Contact Form Input Validation ---');
        const badContactRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/contact-us',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            name: '',
            email: 'invalid-email',
            message: ''
        });
        assert(badContactRes.status === 400, 'Invalid contact submission rejected with 400 Bad Request');

        // TEST 10: File Upload Security & Path Traversal Defense
        console.log('\n--- TEST 10: File Upload Security & Path Traversal Defense ---');
        const adminToken = signToken({
            id: '507f1f77bcf86cd799439011',
            email: 'admin@test.com',
            fullName: 'Super Admin',
            role: 'admin'
        });

        const boundary = '----WebKitFormBoundaryTest1234';
        const maliciousPayload = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="petId"',
            '',
            '507f1f77bcf86cd799439011',
            `--${boundary}`,
            'Content-Disposition: form-data; name="photo"; filename="../../shell.php"',
            'Content-Type: application/x-php',
            '',
            '<?php echo "hacked"; ?>',
            `--${boundary}--`
        ].join('\r\n');

        const uploadRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/manage-pet-photo',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(maliciousPayload)
            }
        }, maliciousPayload);
        assert(uploadRes.status === 400, 'Malicious file upload (.php/path traversal) is strictly rejected with 400 Bad Request', `Got ${uploadRes.status}`);

        // TEST 11: User Adoption Request Logic (Verify Bug Fix for UserPendingRequestData)
        console.log('\n--- TEST 11: User Adoption Requests Bug Fix Verification ---');
        const userAdoptionRes = await makeRequest({
            hostname: '127.0.0.1',
            port: PORT,
            path: '/adoption-pets-request',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${fakeUserToken}`
            }
        });
        assert(userAdoptionRes.status === 200, 'UserPendingRequestData successfully queries with user ID (no ObjectId casting crash)', `Got ${userAdoptionRes.status}`);

        console.log('\n====================================================');
        console.log(`📊 AUDIT RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
        console.log('====================================================');

    } catch (err) {
        console.error('Fatal test error:', err);
    } finally {
        server.close();
        process.exit(failedCount > 0 ? 1 : 0);
    }
}

runTests();
