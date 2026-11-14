import {useForm} from "react-hook-form";
import axios from "axios";
import {useState, useEffect, useContext} from "react";
import {toast} from "react-toastify";
// import { Link } from "react-router-dom";
// import { FaTrash } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
// import Modal from "react-bootstrap/Modal";
// import EditForm from "./users/EditForm";
// import { userContext } from "../App";
// import { useNavigate } from "react-router-dom";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

function ManageUser() {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setFocus,
        setValue,
    } = useForm();

    // const [admin, setAdmin] = useState([]);

    // const navigate = useNavigate();

    async function onSubmit(data) {
        try {
            // console.log(data);
            const token = utilityFunctions.getCookieValue("userAuthToken");
            const url = Server_URL + "user-registration";
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
                // navigate('/user/signin');
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
                <h3 style={{textAlign: "center"}}>Create User Account</h3>
                <div className="row">
                    <div className="col-md-8 offset-md-2 ">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="fullName" className="form-label">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                className="form-control"
                                                placeholder="Enter your Full Name"
                                                {...register("fullName", {
                                                    required: "Full Name is required",
                                                    minLength: {
                                                        value: 3,
                                                        message: "Full Name must be at least 3 characters",
                                                    },
                                                    validate: {
                                                        noLeadingOrTrailingSpaces: (value) =>
                                                            value.trim() === value ||
                                                            "No leading or trailing spaces allowed",
                                                        noSpecialChars: (value) =>
                                                            /^[a-zA-Z\s]+$/.test(value) ||
                                                            "Full Name can only contain letters and spaces",
                                                    },
                                                })}
                                                onBlur={(e) => {
                                                    // Remove leading and trailing spaces
                                                    e.target.value = e.target.value.trim();
                                                    setValue("fullName", e.target.value); // Update the value with modified input
                                                }}
                                            />
                                            {errors.fullName && (
                                                <p className="text-danger">{errors.fullName.message}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="email" className="form-label">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="form-control"
                                                placeholder="Enter your gmail address"
                                                {...register("email", {
                                                    required: "Email is required",
                                                    pattern: {
                                                        value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                                                        message: "Only Gmail addresses are allowed",
                                                    },
                                                })}
                                            />
                                            {errors.email && (
                                                <p className="text-danger">{errors.email.message}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="password" className="form-label">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                className="form-control"
                                                placeholder="Enter the password"
                                                {...register("password", {
                                                    required: "Password is required",
                                                    minLength: {
                                                        value: 6,
                                                        message:
                                                            "Password must be at least 6 characters long",
                                                    },
                                                })}
                                            />
                                            {errors.password && (
                                                <p className="text-danger">{errors.password.message}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Mobile Number</label>
                                            <input
                                                {...register("mobile", {
                                                    required: "Mobile Number is required",
                                                    pattern: {
                                                        value: /^[0-9]{1,12}$/,
                                                        message: "Mobile Number must be up to 12 digits only",
                                                    },
                                                })}
                                                className="form-control"
                                                type="tel"
                                                placeholder="Enter your Mobile Number"
                                            ></input>
                                            {errors.mobile && (
                                                <p className="text-danger">{errors.mobile.message}</p>
                                            )}
                                        </div>

                                        <div className="col-12 mb-3">
                                            <label className="form-label">Address</label>
                                            <textarea
                                                {...register("address", {required: true})}
                                                className="form-control shadow"
                                                placeholder="Enter your Address"
                                            ></textarea>
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

export default ManageUser;
