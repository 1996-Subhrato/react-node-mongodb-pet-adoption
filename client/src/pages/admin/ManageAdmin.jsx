import {useForm} from "react-hook-form";
import axios from "axios";
import {useState, useEffect} from "react";
import {toast} from "react-toastify";
// import { Link } from "react-router-dom";
// import { FaTrash } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
// import Modal from "react-bootstrap/Modal";
// import EditForm from "./users/EditForm";
// import { useNavigate } from "react-router-dom";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

function ManageAdmin() {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setFocus,
        setValue,
    } = useForm();

    async function onSubmit(data) {
        try {
            // console.log(data);
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "admin-registration";
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer: ${token} `,
                },
            });
            //   console.log(response.data);
            const {error, message} = response.data;
            if (error) {
                // alert(message);
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
                reset();
                // alert(message);
                toast.success(message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                // getAdminData();
                // setTimeout(() => {
                //   navigate("/adminsignin");
                // }, 3000);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        setFocus("fullName");
        // getAdminData();
    }, []);

    return (
        <>
            <div className="container py-5">
                <h3 className="text-warning" style={{textAlign: "center"}}>
                    Create Admin Account
                </h3>

                <div className="row justify-content-center">
                    <div className="col-md-9">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row">
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Select Category</label> <br/>
                                            <select
                                                className="form-control"
                                                {...register("userRole", {
                                                    required: "This field is required",
                                                })}
                                                name="userRole"
                                                id="userRole"
                                            >
                                                {/* {errors.category && <span>First Name is required</span>} */}
                                                <option value="">Please Select Category</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Sub-Admin">Sub-Admin</option>
                                            </select>

                                            {errors.userRole && (
                                                <p className="text-danger">{errors.userRole.message}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>FullName </label>
                                            <input
                                                {...register("fullName", {
                                                    required: "This field is required",
                                                    validate: (value) => value.trim() === value || "No leading or trailing spaces allowed",
                                                })}
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter your FullName"
                                                onBlur={(e) => {
                                                    // Remove leading and trailing spaces
                                                    e.target.value = e.target.value.trim();
                                                    setValue("fullName", e.target.value); // Update value with modified input
                                                }}
                                            />
                                            {errors.fullName && (
                                                <p className="text-danger">{errors.fullName.message}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Email</label>
                                            <input
                                                {...register("email", {
                                                    required: true,
                                                    pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                                })}
                                                className="form-control"
                                                type="email"
                                                placeholder="Enter your Email"
                                            />
                                            {errors.email && (
                                                <p className="text-danger">
                                                    {errors.email.type === "pattern"
                                                        ? "Please enter a valid Gmail address"
                                                        : "This field is required"}
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Password</label>
                                            <input
                                                {...register("password", {
                                                    required: true,
                                                    minLength: 6,
                                                })}
                                                className="form-control"
                                                type="password"
                                                placeholder="Enter your Password"
                                            />
                                            {errors.password && (
                                                <p className="text-danger">
                                                    {errors.password.type === "minLength"
                                                        ? "Password must be at least 6 characters"
                                                        : "This field is required"}
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Mobile Number</label>
                                            <input
                                                {...register("mobile", {
                                                    required: true,
                                                    pattern: /^[0-9]{10,12}$/,
                                                })}
                                                className="form-control"
                                                type="tel"
                                                placeholder="Enter your Mobile Number"
                                            />
                                            {errors.mobile && (
                                                <p className="text-danger">
                                                    {errors.mobile.type === "pattern"
                                                        ? "Mobile Number must be between 10 to 12 digits"
                                                        : "This field is required"}
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-12 mb-3">
                                            <label className="form-label">Address</label>
                                            <textarea
                                                {...register("address", {required: true})}
                                                className="form-control shadow"
                                                placeholder="Enter the Address"></textarea>

                                            {errors.address && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>
                                    </div>

                                    <button className="btn btn-warning mt-2">Register</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageAdmin;
