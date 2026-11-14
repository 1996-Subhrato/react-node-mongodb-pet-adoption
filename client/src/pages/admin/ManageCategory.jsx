import {useForm} from "react-hook-form";
import axios from "axios";
import {useState, useEffect, useContext} from "react";
import {toast} from "react-toastify";
// import { FaTrash } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
// import Modal from "react-bootstrap/Modal";
// import EditForm from "./users/EditForm";
// import { userContext } from "../App";
// import { useNavigate } from "react-router-dom";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

function ManageCategory() {
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setFocus,
    } = useForm();

    // const [admin, setAdmin] = useState([]);


    // const navigate = useNavigate();

    async function onSubmit(data) {
        try {
            // console.log(data);
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-category";
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
                // getCategoryData();
                // navigate('/user/signin');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        setFocus('categoryName')
        // getAdminData();
    }, []);

    return (
        <>
            <div className="container py-5">
                <h3 style={{textAlign: 'center'}} className="text-warning">Add Category</h3>
                <div className="row">
                    <div className="col-md-8 offset-md-2 ">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* <form> */}
                                    <div className="mb-3">
                                        <label>Category Name</label>
                                        <input
                                            {...register("categoryName", {required: true})}
                                            className="form-control"
                                            type="text"
                                            placeholder="Enter Category Name"
                                        ></input>
                                        <br/>
                                        {errors.categoryName && (
                                            <p className="text-danger">This field is required</p>
                                        )}
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            {...register("description")}
                                            className="form-control shadow"
                                            placeholder="Enter Category Description"
                                        ></textarea>
                                        {errors.description && (
                                            <p className="text-danger">This field is required</p>
                                        )}
                                    </div>
                                    <button className="btn btn-warning mt-2">Add Category</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default ManageCategory;
