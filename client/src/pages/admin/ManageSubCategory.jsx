import {useForm} from "react-hook-form";
import axios from "axios";
import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
// import { FaTrash } from "react-icons/fa";
// import { CiEdit } from "react-icons/ci";
// import Modal from "react-bootstrap/Modal";
// import EditForm from "./users/EditForm";
// import { userContext } from "../App";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

function ManageSubCategory() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setFocus,
    } = useForm();

    // const [admin, setAdmin] = useState([]);
    const [category, setCategory] = useState([]);


    async function getCategoryData() {
        try {
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-category";
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            });
            // console.log(response.data);
            const {error, message} = response.data;
            console.log(error, message);

            if (error && message === "Please SignIn First!!") {
                alert(message);

                navigate("/adminsignin")
            } else if (error) {
                alert(message);

            } else {
                const {result} = response.data;
                setCategory(result);
            }
        } catch (error) {
            console.log(error.message);
        }
    }


    // const navigate = useNavigate();

    async function onSubmit(data) {
        try {
            // console.log(data);
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-subcategory";
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            });
            console.log(response.data);
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
                reset();
                // alert(message);
                // getCategoryData();
                // navigate('/user/signin');
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        setFocus('category')
        // getAdminData();
        getCategoryData();
    }, []);

    return (
        <>
            <div className="container py-5">
                <h3 style={{textAlign: 'center'}} className="text-warning">Add Breed</h3>
                <div className="row">
                    <div className="col-md-8 offset-md-2 ">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* <form> */}
                                    <div className="mb-3">
                                        <label htmlFor="category">Select Category</label><br/>
                                        <select {...register('category', {required: true})} name="category"
                                                id="category" className="form-control shadow">
                                            <option value="">Please Select Category</option>
                                            {category.map(x =>
                                                <option value={x._id} key={x._id}>{x.categoryName}</option>
                                            )}
                                        </select>
                                        {errors.category && (
                                            <p className="text-danger">This field is required</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label>Breed Name</label>
                                        <input
                                            {...register("subcategoryName", {required: true})}
                                            className="form-control shadow"
                                            type="text"
                                            placeholder="Enter SubCategory Name"
                                        ></input>
                                        <br/>
                                        {errors.subcategoryName && (
                                            <p className="text-danger">This field is required</p>
                                        )}
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            {...register("subcategorydescription", {required: true})}
                                            className="form-control shadow"
                                            placeholder="Enter SubCategory Description"
                                        ></textarea>
                                        {errors.subcategorydescription && (
                                            <p className="text-danger">This field is required</p>
                                        )}
                                    </div>
                                    <button className="btn btn-warning mt-2">Add Breed</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
}

export default ManageSubCategory;
