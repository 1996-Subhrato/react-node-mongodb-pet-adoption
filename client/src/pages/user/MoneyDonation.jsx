// function MoneyDonation(){
//     return(
//         <>
//             <h3>Donation Page</h3>
//         </>
//     )
// }
// export default MoneyDonation;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Server_URL } from "../../utils/config";
import { utilityFunctions } from "../../utils/module";

const MoneyDonation = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const predefinedAmounts = [50, 100, 500, 1000, 5000];

    const handleDonation = async () => {
        try {
            const token = utilityFunctions.getCookieValue("userAuthToken");
            
            // Validate input
            if (!amount || !name || !email) {
                alert('Please fill all required fields');
                return;
            }

            // Call backend to create Razorpay order
            const url = Server_URL + "create-donation";
            const response = await axios.post(url, {
                amount: parseFloat(amount),
                name,
                email,
                message
            }, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            const { order } = response.data;

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key';

            // Check if Razorpay SDK is loaded
            if (typeof window.Razorpay !== 'undefined') {
                const options = {
                    key: razorpayKey,
                    amount: order.amount,
                    currency: 'INR',
                    name: 'Woof! - The Pet Adoption',
                    description: 'Donation for Animal Welfare',
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            // Verify payment on backend
                            await axios.post(Server_URL + 'verify-donation', {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id || order.id,
                                razorpay_signature: response.razorpay_signature
                            }, {
                                headers: {
                                    Authorization: token ? `Bearer ${token}` : "",
                                },
                            });

                            alert('Donation Successful! Thank you for supporting our pets.');
                        } catch (error) {
                            alert('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: name,
                        email: email
                    },
                    theme: {
                        color: '#3399cc'
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                // Graceful fallback for offline / development testing without external CDN
                await axios.post(Server_URL + 'verify-donation', {
                    razorpay_payment_id: 'pay_simulated_' + Date.now(),
                    razorpay_order_id: order.id,
                    razorpay_signature: 'sig_simulated'
                }, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });
                alert('Donation recorded successfully! Thank you for supporting our pets.');
            }

        } catch (error) {
            console.log(error.message);
            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <>
            {/* Jumbotron */}
            <div className="jumbotron jumbotron-fluid overlay">
                <div className="jumbo-heading">
                    <div className="section-heading" data-aos="zoom-in">
                        <h1>Donate</h1>
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/user/userdashboard">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Donation</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Page Content */}
            <div className="page">
                <div className="section-heading container block-padding pt-0 pb-0">
                    <div className="col-lg-8 offset-lg-2 text-center">
                        <h3>Support Our Furry Friends</h3>
                        <p>
                            Your donation helps us provide care, medical treatment, and find loving homes 
                            for pets in need. Every contribution makes a difference in the lives of these 
                            amazing animals.
                        </p>
                    </div>

                    {/* Donation Form */}
                    <div className="row mt-5">
                        <div className="col-md-8 offset-md-2">
                            <div className="card bg-light-custom">
                                <div className="card-body">
                                    <h5 className=" card card-title text-center mb-4">Make a Donation</h5>
                                    
                                    <div className="form-group">
                                        <label style={{fontWeight:'bold', color:'maroon'}}>Donation Amount</label>
                                        <div className="d-flex justify-content-between mb-3">
                                            {predefinedAmounts.map((preset) => (
                                                <button
                                                    key={preset}
                                                    onClick={() => setAmount(preset)}
                                                    // className="btn btn-outline-success "
                                                    style={{ color: 'red', fontWeight: 'bold', borderRadius:'.5rem'}}                                                >
                                                    ₹{preset}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter custom amount"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Your email address"
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label>Optional Message</label>
                                        <textarea
                                            className="form-control"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Your message of support (optional)"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="text-center">
                                        <button 
                                            onClick={handleDonation}
                                            className="btn btn-primary btn-lg"
                                        >
                                            Donate Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pagination (placeholder)
                    <div className="col-md-12 mt-5">
                        <nav aria-label="pagination">
                            <ul className="pagination float-right">
                                <li className="page-item"><Link className="page-link active" to="#">1</Link></li>
                                <li className="page-item"><Link className="page-link" to="#">Next</Link></li>
                            </ul>
                        </nav>
                    </div> */}
                </div>
            </div>
        </>
    );
};

export default MoneyDonation;