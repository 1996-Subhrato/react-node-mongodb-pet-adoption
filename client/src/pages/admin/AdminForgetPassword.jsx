import {useForm} from "react-hook-form";
import axios from "axios";
import {useState} from "react";
import {Server_URL} from "../../utils/config";
import {useNavigate, Link} from "react-router-dom";
import {toast} from "react-toastify";

function AdminForgetPassword() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm();

    async function onSubmit(data) {
        try {
            console.log(data);
            const url = Server_URL + "admin-forgetpassword";
            const response = await axios.post(url, data);
            const {error, message} = response.data;

            if (error) {
                // alert(message); // Show error message if email is not valid
                toast.error(message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                // alert("OTP has been sent to your email. Please check your inbox.");
                toast.success(
                    "OTP has been sent to your email. Please check your inbox.",
                    {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    }
                );
                console.log("Storing email in local storage:", data.email); // Log email before storing
                localStorage.setItem("email", data.email); // Store email in local storage
                navigate("/adminverifyotp"); // Navigate to OTP verification page
            }
        } catch (e) {
            console.log(e);
            alert("An error occurred. Please try again.");
        }
    }

    return (
        <div className="container py-5">
            <h3 style={{textAlign: "center"}}>Admin Forget Password</h3>

            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="card shadow-lg">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input
                                        {...register("email", {required: true})}
                                        className="form-control"
                                        type="email"
                                        placeholder="Enter your Email"
                                    />
                                    {errors.email && (
                                        <p className="text-danger">This field is required</p>
                                    )}
                                </div>
                                <button className="btn btn-warning mt-2">
                                    Verify & Send OTP
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <Link to="/adminsignin" className="fw-bold">
                                    <i className="fa fa-angle-left"></i> Back
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminForgetPassword;
