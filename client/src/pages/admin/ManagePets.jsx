import {useForm} from "react-hook-form";
import axios from "axios";
import {toast} from "react-toastify";
import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

function ManagePets() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        setFocus,
    } = useForm();

    const [category, setCategory] = useState([]);
    const [subcategory, setSubcategory] = useState([]);

    async function onSubmit(data) {
        try {
            // console.log(data);
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-pets";
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const {error, message} = response.data;
            // console.log(response.data);

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
                // alert(message);
                reset();
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
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    // Func1
    async function getCategoryData() {
        try {
            // console.log(data)
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-category";
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : ""
                }
            });
            console.log(response.data);
            const {error, message} = response.data;
            console.log(error, message);

            if (error && message === "Please SignIn First!!") {
                alert(message);

                navigate("/adminsignin")
            } else if (error) {
                alert(message);

            } else {
                const {result} = response.data;
                // console.log(result)
                setCategory(result);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // Func2
    async function getSubCategoryData(categoryId) {
        try {
            // console.log(data)
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-subcategory/" + categoryId;
            const response = await axios.get(url, {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : ""
                    }
                }
            );
            console.log(response.data);
            const {error, message} = response.data;
            console.log(error, message);

            if (error && message === "Please SignIn First!!") {
                alert(message);

                navigate("/adminsignin")
            } else if (error) {
                alert(message);

            } else {
                const {result} = response.data;
                // console.log(result)
                setSubcategory(result);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        getCategoryData();
        // getSubCategoryData();
    }, []);


    return (
        <>
            <div className="container py-5">
                <h3 style={{textAlign: "center"}}>Manage Pets</h3>
                <div className="row justify-content-center">
                    <div className="col-md-9">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="category">Select Pet Category</label><br/>
                                            <select {...register('category', {required: true})}
                                                    onChange={(e) => getSubCategoryData(e.target.value)} name="category"
                                                    id="category" className="form-control shadow">
                                                <option value="">Please Select Pet Category</option>
                                                {category.map(x =>
                                                    <option value={x._id} key={x._id}>{x.categoryName}</option>
                                                )}
                                            </select>
                                            {errors.category && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        {subcategory && <div className="col-md-6 mb-3">
                                            <label htmlFor="category">Select Pet Breed</label><br/>
                                            <select {...register('subcategory', {required: true})} name="subcategory"
                                                    id="subcategory" className="form-control shadow">
                                                <option value="">Please Select Pet Breed</option>
                                                {subcategory.map(x =>
                                                    <option value={x._id} key={x._id}>{x.subcategory}</option>
                                                )}
                                            </select>
                                            {errors.subcategory && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>
                                        }

                                        <div className="col-md-6 mb-3">
                                            <label>Pet Name</label>
                                            <input
                                                {...register("petName", {required: true})}
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Pet Name"
                                            ></input>
                                            <br/>
                                            {errors.petName && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Color</label>
                                            <input
                                                {...register("petColor", {required: true})}
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Pet Color"
                                            ></input>
                                            <br/>
                                            {errors.petColor && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Weight</label>
                                            <input
                                                {...register("petWeight", {required: true})}
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Pet Weight"
                                            ></input>
                                            <br/>
                                            {errors.petWeight && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Gender</label>
                                            <input
                                                {...register("petGender", {required: true})}
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Pet Gender"
                                            ></input>
                                            <br/>
                                            {errors.petGender && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Age</label>
                                            <input
                                                {...register("petAge", {required: true})}
                                                className="form-control"
                                                type="text"
                                                placeholder="Enter Pet Age"
                                            ></input>
                                            <br/>
                                            {errors.petAge && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="Pet">Vaccinated?</label>
                                            <br/>
                                            <select
                                                {...register("vaccinated", {required: true})}
                                                name="vaccinated"
                                                id="vaccinated"
                                                className="form-control shadow"
                                            >
                                                <option value="">
                                                    Is Pet Vaccinated?
                                                </option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                            {errors.vaccinated && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="Pet">Friendly to Other Pets</label>
                                            <br/>
                                            <select
                                                {...register("friendlyToOtherPets", {required: true})}
                                                name="friendlyToOtherPets"
                                                id="friendlyToOtherPets"
                                                className="form-control shadow"
                                            >
                                                <option value="">
                                                    Friendly to Other Pets?
                                                </option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                            {errors.friendlyToOtherPets && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="Pet">Children Friendly</label>
                                            <br/>
                                            <select
                                                {...register("childrenFriendly", {required: true})}
                                                name="childrenFriendly"
                                                id="childrenFriendly"
                                                className="form-control shadow"
                                            >
                                                <option value="">
                                                    Is Pet Children Friendly?
                                                </option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                            {errors.childrenFriendly && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>

                                        <div className="col-12 mb-3">
                                            <label className="form-label">About the Pet</label>
                                            <textarea
                                                {...register("aboutPet", {required: true})}
                                                className="form-control shadow"
                                                placeholder="Enter About Pet"
                                            ></textarea>
                                            {errors.aboutPet && (
                                                <p className="text-danger">This field is required</p>
                                            )}
                                        </div>
                                    </div>

                                    <button className="btn btn-warning mt-2">Add Pet</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManagePets;
