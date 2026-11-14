import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [pet, setPet] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [request, setRequest] = useState([]);

    async function getPetData() {
        try {
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const response = await axios.get(`${Server_URL}manage-pets`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            const {error, message, result} = response.data;
            if (error) {
                if (message === "Please SignIn First!!") {
                    alert(message);
                    navigate("/adminsignin");
                } else {
                    alert(message);
                }
            } else {
                setPet(result);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    async function fetchFeedbackData() {
        try {
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const response = await axios.get(`${Server_URL}fetch-feedbacks`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.data.error) {
                setFeedbacks(response.data.feedbacks.slice(0, 3));
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    }

    // adoption request part
    async function getAdoptionData() {
        try {
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = `${Server_URL}adoption-pets`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            const {error, message, result} = response.data;
            if (error) {
                if (message === "Please SignIn First!!") {
                    alert(message);
                    navigate("/adminsignin");
                } else {
                    alert(message);
                }
            } else {
                setRequest(result);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        getPetData();
        fetchFeedbackData();
        getAdoptionData();
    }, []);

    return (
        <>
            <div className="container">
                {/* Welcome Admin */}
                <div className="row justify-content-center">
                    <div className="col-md-6 shadow my-5">
                        <div className="py-5">
                            <h3 className="text-center mb-0 text-warning">Welcome Admin</h3>
                        </div>
                    </div>
                </div>

                {/* Available Pets For Adoption */}
                <h5 className="text-center">Available Pets For Adoption</h5>
                <div className="row mb-5">
                    {pet.length === 0 ? <div className="text-center text-danger fw-bold">No Data Available</div> :
                        pet.filter((value) => value.isAvailable === "yes").slice(0, 3).map((value) => (
                            <div className="card col-md-4 mb-4" key={value._id}>
                                <div className="card adopt-card shadow">
                                    <img
                                        src={`${Server_URL}${value.petPhoto}`}
                                        className="card-img-top"
                                        alt="PetPhoto"
                                        style={{height: "250px", objectFit: "cover"}}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{value.petName}</h5>
                                        <p className="card-text">
                                            <strong>Type:</strong> {value.petTypeCategory}
                                        </p>
                                        <p className="card-text">
                                            <strong>Breed:</strong> {value.petBreedSubCategory}
                                        </p>
                                        <p className="card-text">
                                            <strong>Age:</strong> {value.petAge}
                                        </p>
                                        <p
                                            className={`card-text ${
                                                value.isAvailable === "yes"
                                                    ? "text-success"
                                                    : "text-danger"
                                            }`}
                                        >
                                            <strong>Available:</strong> {value.isAvailable}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Recently Adopted Pets */}
                <h5 className="text-center">Recently Adopted Pets</h5>
                <div className="row mb-5">
                    {pet.length === 0 ? <p className="text-center text-danger fw-bold">No Data Available</p> :
                        pet.filter((value) => value.isAvailable === "Adopted").slice(0, 3).map((value) => (
                            <div className="card col-md-4 mb-4" key={value._id}>
                                <div className="card adopt-card shadow">
                                    <img
                                        src={`${Server_URL}${value.petPhoto}`}
                                        className="card-img-top"
                                        alt="PetPhoto"
                                        style={{height: "250px", objectFit: "cover"}}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{value.petName}</h5>
                                        <p className="card-text">
                                            <strong>Type:</strong> {value.petTypeCategory}
                                        </p>
                                        <p className="card-text">
                                            <strong>Breed:</strong> {value.petBreedSubCategory}
                                        </p>
                                        <p className="card-text">
                                            <strong>Age:</strong> {value.petAge}
                                        </p>
                                        <p
                                            className={`card-text ${
                                                value.isAvailable === "Adopted"
                                                    ? "text-danger"
                                                    : "text-success"
                                            }`}
                                        >
                                            <strong>Available:</strong> {value.isAvailable}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="d-flex justify-content-center mb-5">
                    <Link to="/admin/viewpets" className="btn btn-secondary mx-2">
                        View More & Details
                    </Link>

                    <Link to="/admin/managepets" className="btn btn-secondary mx-2">
                        Add more Pets
                    </Link>
                </div>

                {/* Manage Users */}
                <div className="card text-dark shadow-lg mb-5" style={{backgroundColor: '#F4F1BB'}}>
                    <div className="card-body">
                        {/* Title */}
                        <h5 className="card-title text-center fw-bold mb-0">Manage Users</h5>

                        {/* Description */}
                        <p className="card-text text-center">
                            View and manage all registered users efficiently. Monitor their
                            details efficiently and keep the system updated.
                        </p>

                        {/* Button */}
                        <div className="d-flex justify-content-center mt-2">
                            <Link to="/admin/viewusers" className="btn btn-primary btn-lg px-4">
                                View Users
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Latest Users Feedbacks */}
                <h5 className="text-center">Latest Users Feedbacks</h5>

                <div className="row mb-5">
                    {feedbacks.length > 0 ? (
                        feedbacks.map((feedback) => (
                            <div className="col-md-4 mb-4 mt-4" key={feedback._id}>
                                <div className="card shadow-sm h-100" style={{borderRadius: "12px", padding: "1rem"}}>
                                    <div className="d-flex align-items-start">
                                        <img
                                            src={`${Server_URL}${feedback.petDetails.petPhoto}`}
                                            alt="PetPhoto"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                                marginRight: "10px",
                                            }}
                                        />
                                        <div>
                                            <h6 className="mb-1 text-primary">
                                                {feedback.petDetails.petName}
                                            </h6>
                                            <p className="mb-0 text-muted">
                                                <strong>Feedback By:</strong>
                                                {feedback.userDetails.fullName}
                                            </p>
                                        </div>
                                    </div>
                                    <hr/>
                                    <p className="mb-2">
                                        <strong>Feedback:</strong> {feedback.feedback}
                                    </p>
                                    {/* <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                    <strong>Email:</strong> {feedback.userDetails.email} <br />
                    <strong>Mobile:</strong> {feedback.userDetails.mobile} <br />
                    <strong>Address:</strong> {feedback.userDetails.address}
                  </p> */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-danger fw-bold">No Data Available</p>
                    )}
                    <div className="text-center">
                        <Link to="/admin/feedback" className="btn btn-secondary">
                            Show More
                        </Link>
                    </div>
                </div>

                {/* Requests For Adoption */}
                <div className="mb-5">
                    <h5 style={{textAlign: "center"}}>Requests For Adoption</h5>
                    <div className="row">
                        {request.length === 0 ? <p className="text-center text-danger fw-bold">No Data Available</p> :
                            request.map((value, index) => (
                                <div key={index} className="col-md-4">
                                    <div className=" h-100 text-center">
                                        <div className=" adopt-card shadow">
                                            <h5 className="card-title">{value.fullName}</h5>
                                            <p className="card-text">
                                                <strong>Email:</strong> {value.email}
                                            </p>
                                            <p className="card-text">
                                                <strong>City:</strong> {value.city}
                                            </p>
                                            <p className="card-text">
                                                <strong>Mobile:</strong> {value.mobileNo1}
                                            </p>
                                            <p className="card-text">
                                                <strong>Status:</strong> {value.adoptionStatus}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="text-center">
                        <Link to="/admin/pendingrequests" className="btn btn-secondary">
                            Show More Requests
                        </Link>
                    </div>
                </div>

                {/* Manage Homeless Pet Reports */}
                <div className="card bg-light text-dark shadow-lg">
                    <div className="card-body">
                        {/* Icon */}
                        <div className="text-center mb-3">
                            <i className="fas fa-file-alt fa-3x" style={{color: "navy"}}></i>
                        </div>

                        {/* Title */}
                        <h5 className="card-title text-center fw-bold mb-0">
                            Manage Homeless Pet Reports
                        </h5>

                        {/* Description */}
                        <p className="card-text text-center mt-3">
                            View and manage reports of homeless pets submitted by users. Take
                            necessary actions to help these animals find care and support.
                        </p>

                        {/* Button */}
                        <div className="d-flex justify-content-center mt-4">
                            <Link to="/admin/requestfordonationadmin" className="btn btn-dark btn-lg px-4">
                                View Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
