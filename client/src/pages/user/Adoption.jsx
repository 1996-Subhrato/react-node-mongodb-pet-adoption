import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from "react";
import { Server_URL } from "../../utils/config";
import { utilityFunctions } from "../../utils/module";

const Adoption = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);

    async function getPetGalleryData() {
        try {
            const token = utilityFunctions.getCookieValue("userAuthToken");
            const url = Server_URL + "manage-pets";
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            const { error, message, result } = response.data;

            if (error && message === "Please SignIn First!!") {
                alert(message);
                navigate("/usersignin");
            } else if (error) {
                alert(message);
            } else {
                setPets(result);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        getPetGalleryData();
    }, []);

    return (
        <>
            {/* Jumbotron */}
            <div className="jumbotron jumbotron-fluid overlay">
                <div className="jumbo-heading">
                    <div className="section-heading" data-aos="zoom-in">
                        <h1>Adoption</h1>
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/user/userdashboard">Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Adoption</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Page Content */}
            <div className="page">
                <div className="container block-padding pt-0 pb-0">
                    <div className="col-lg-8 offset-lg-2 text-center">
                        <h3>Find a New Furry Friend</h3>
                        <p>
                            Discover the joy of adopting a pet and providing them with a forever home.
                            Our selection includes pets of various ages and personalities, ready to find
                            a caring family. Browse through and meet your potential new friend!
                        </p>
                    </div>

                    {/* Pet Cards */}
                    <div className="row mt-5">
                        {pets.map((value, index) => (
                            <div key={index} className="adopt-card col-md-6 col-xl-3 res-margin">
                                <div className="card bg-light-custom">
                                    <div className="thumbnail text-center">
                                        {/* Pet Image */}
                                        <img
                                            src={`${Server_URL}${value.petPhoto}`}
                                            className="border-irregular1 img-fluid"
                                            style={{height: '130px', width: '170px'}}
                                            alt={value.petName}
                                        />
                                        {/* Pet Details */}
                                        <div className="caption-adoption">
                                            <h6 className="adoption-header">{value.petName}</h6>
                                            <ul className="list-unstyled">
                                                <li><strong>Gender:</strong> {value.petGender}</li>
                                                <li><strong>Children Friendly:</strong> {value.childrenFriendly}</li>
                                                <li><strong>Age:</strong> {value.petAge}</li>
                                                <li className="mt-2">
                                                    <strong>Available:</strong> 
                                                    <span
                                                        style={{
                                                            color: 'white',
                                                            backgroundColor: value.isAvailable === 'Adopted' ? '#BA1200' : '#55a630',
                                                            padding: "5px 10px",
                                                            borderRadius: "5px",
                                                            animation: value.isAvailable === 'Adopted' ? 'zoomInOut 1s ease infinite' : 'none',
                                                            display: 'inline-block',
                                                            marginLeft:'.7rem'
                                                        }}
                                                    >
                                                        {value.isAvailable}
                                                    </span>
                                                </li>
                                            </ul>
                                            {/* More Info Button */}
                                            <div className="text-center">
                                                <Link to={`/user/mainadoption/${value._id}`} className="btn btn-primary">More Info</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Inline CSS for zoom-in/zoom-out animation */}
            <style>
                {`
                    @keyframes zoomInOut {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.1);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default Adoption;
