import React, {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import Card from "react-bootstrap/Card";
import axios from "axios";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

function UserDashboard() {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [allPetsGallery, setAllPetsGallery] = useState([]);
    const [request, setRequest] = useState([]);

    async function fetchLimitedPetData() {
        try {
            const token = utilityFunctions.getCookieValue("userAuthToken");
            const url = Server_URL + "manage-pets";
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            const {error, result} = response.data;

            if (!error) {
                // Filter pets where isAvailable is 'yes' and display only the first 3
                const availablePets = result
                    .filter((pet) => pet.isAvailable === "yes")
                    .slice(0, 3);
                setPets(availablePets);
            }
        } catch (error) {
            console.log("Error fetching pets:", error.message);
        }
    }

    async function fetchGalleryData() {
        try {
            const token = utilityFunctions.getCookieValue("userAuthToken");
            const url = Server_URL + "AllPetGalleryData";
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            const {error, result} = response.data;
            if (!error) {
                setAllPetsGallery(result);
            }
        } catch (error) {
            console.log("Error fetching pet gallery:", error.message);
        }
    }

    // Fetch adoption requests and pet details
    async function getAdoptionData() {
        try {
            const token = utilityFunctions.getCookieValue("userAuthToken");
            const url = Server_URL + "adoption-pets-request";
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            const {error, message, result} = response.data;

            if (error && message === "Please SignIn First!!") {
                alert(message);
                navigate("/usersignin");
            } else if (error) {
                alert(message);
            } else {
                // Fetching pet details for each adoption request
                const requestsWithPets = await Promise.all(
                    result.map(async (user) => {
                        const petResponse = await axios.get(
                            `${Server_URL}pets/${user.petId}`,
                            {
                                headers: {
                                    Authorization: token ? `Bearer ${token}` : "",
                                },
                            }
                        );
                        return {
                            ...user,
                            petDetails: petResponse.data.pet,
                        };
                    })
                );
                setRequest(requestsWithPets);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        fetchLimitedPetData();
        fetchGalleryData();
        getAdoptionData();
    }, []);

    const style = {
      display: "flex",
      width: "100%",
      height: "800px",
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    };

    return (
        <>
            <div id="top">
                <div style={style}>
                    <img
                        src="/assets/img/slide1.jpg"
                        alt="Cover Photo"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />

                    {/* Text Wrapper */}
                    <div
                        className="ls-l header-wrapper"
                        style={{
                            position: "absolute",
                            left: "20px",
                            top: "20px",
                            color: "white",
                            padding: "20px",
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Adding text shadow for better readability
                        }}
                    >
                        <div className="header-text dog-elements">
                            <h1>Adopt a pet today!</h1>
                            <div className="d-none d-sm-block">
                                <p className="header-p">
                                    Explore our list of dogs, cats, and other pets available for
                                    adoption near you
                                </p>
                                <Link
                                    className="btn btn-primary"
                                    to="/user/adoption-page" // Update the path to match your routes
                                    style={{
                                        marginTop: "10px",
                                        backgroundColor: "#007bff", // Bootstrap primary color
                                        color: "white",
                                        padding: "10px 20px",
                                        textDecoration: "none",
                                        borderRadius: "5px",
                                    }}
                                >
                                    Adopt Today
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br/>
            <br/>
            <hr/>

            {/* Adoption Cards Section */}
            <div className="container section-heading text-center">
                <h3 className="text-center ">Meet Your New Friend</h3>

                <div className="row mt-5">
                    {pets.map((pet) => (
                        <div key={pet._id} className="col-md-4 " data-aos="zoom-in">
                            <div className="card bg-light-custom adopt-card">
                                {/* <div className="thumbnail text-center"> */}
                                <img
                                    src={`${Server_URL}${pet.petPhoto}`}
                                    className="img-fluid"
                                    alt={pet.petName}
                                    style={{width: '180px', height: '150px'}}
                                />
                                {/* <div className="caption-adoption"> */}
                                <h6>{pet.petName}</h6>
                                <ul className="list-unstyled">
                                    <li>
                                        <strong>Breed:</strong> {pet.petBreedSubCategory}
                                    </li>
                                    <li>
                                        <strong>Gender:</strong> {pet.petGender}
                                    </li>
                                    <li>
                                        <strong>Age:</strong> {pet.petAge}
                                    </li>
                                    <li>
                                        <strong>Available:</strong> {pet.isAvailable}
                                    </li>
                                </ul>
                                <Link
                                    to={`/user/mainadoption/${pet._id}`}
                                    className="btn btn-primary"
                                >
                                    More Info
                                </Link>
                                {/* </div> */}
                                {/* </div> */}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <Link to="/user/adoption-page" className="btn btn-secondary">
                        Explore More
                    </Link>
                </div>
            </div>
            <hr/>
            {/* </section> */}

            {/* All Pets Gallery Section */}
            <section id="all-pets-gallery" className="cat-bg3">
                <div className="container section-heading text-center">
                    <h3>Pets Gallery</h3>
                    <div
                        id="gallery-isotope"
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            margin: "0 -15px",
                            marginLeft: "3rem",
                            marginRight: "3rem",
                        }}
                    >
                        {Array.from(
                            new Map(
                                allPetsGallery.map((image) => [image.petId, image]) // Using `petId` as a key
                            ).values()
                        )
                            .slice(0, 9) // Limit to 9 unique pet images
                            .map((image, index) => (
                                <div
                                    className="dogscats col-lg-3 col-sm-6 col-md-6"
                                    style={{padding: "0 15px"}}
                                    key={index}
                                >
                                    <div className="isotope-item">
                                        <div className="gallery-thumb">
                                            <img
                                                className="img-fluid"
                                                src={`${Server_URL}${image.petPhotoGallery}`}
                                                alt="Pet Gallery Image"
                                                style={{
                                                    width: "100%",
                                                    height: "auto",
                                                    display: "block",
                                                }}
                                            />
                                            <a
                                                href={`${Server_URL}${image.petPhotoGallery}`}
                                                title="PetPhoto"
                                            >
                                                <span className="overlay-mask"></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="text-center mt-4">
                        <Link to="/user/petsgallery" className="btn btn-secondary">
                            Show More
                        </Link>
                    </div>
                </div>
            </section>
            <hr/>

            <div className="section-heading">
                <h3 className="text-center">Your Adoption Requests</h3>
            </div>
            <div className="container">
                <div className="row">
                    {request.slice(0.3).map((user) => (
                        <div className="col-md-4 mb-4" key={user._id}>
                            <Card style={{backgroundColor: "#FFFAFA"}} className="shadow">
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    {/* Adoption Status */}
                                    <div className="text-center mb-3">
                                        <strong>Status:</strong>{" "}
                                        <span
                                            style={{
                                                color: "white",
                                                backgroundColor:
                                                    user.adoptionStatus === "Confirmed"
                                                        ? "green"
                                                        : user.adoptionStatus === "Cancelled"
                                                            ? "red"
                                                            : "orange",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                            }}
                                        >
                      {user.adoptionStatus === "Confirmed"
                          ? "Request Confirmed"
                          : user.adoptionStatus === "Cancelled"
                              ? "Request Cancelled!"
                              : "Pending"}
                    </span>
                                    </div>

                                    {/* User and Pet Details */}
                                    <div>
                                        <Card.Title>{user.fullName}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {user.city}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            <strong>Email:</strong> {user.email} <br/>
                                            <strong>Mobile:</strong> {user.mobileNo1} <br/>
                                        </Card.Text>
                                        {user.petDetails && (
                                            <>
                                                <strong>Pet Name:</strong> {user.petDetails.petName}{" "}
                                                <br/>
                                                <strong>Pet Age:</strong> {user.petDetails.petAge}{" "}
                                                <br/>
                                                <strong>Pet Gender:</strong> {user.petDetails.petGender}{" "}
                                                <br/>
                                                <strong>Pet Weight:</strong> {user.petDetails.petWeight}{" "}
                                                <br/>
                                                <img
                                                    src={`${Server_URL}${user.petDetails.petPhoto}`}
                                                    alt="PetPhoto"
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        maxWidth: "150px",
                                                        borderRadius: ".5rem",
                                                        marginTop: "10px",
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
                <div className="text-center">
                    <Link to="/user/requestedpets" className="btn btn-secondary">
                        View More
                    </Link>
                </div>
            </div>
            <hr/>
            {/* Section: Found Homeless Pet */}
            <div className="card bg-warning text-dark shadow-lg mb-5">
                <div className="card-body">
                    <div className="text-center mb-3">
                        <i className="fas fa-paw fa-3x" style={{color: "brown"}}></i>
                    </div>

                    <h3 className="card-title text-center fw-bold">
                        Found a Homeless Pet?
                    </h3>

                    <h6 className="card-text text-center mt-3">
                        If you've come across a homeless pet, please help us by reporting
                        it. Your actions can make a difference and provide a better life for
                        these animals.
                    </h6>

                    <div className="d-flex justify-content-center mt-4">
                        <Link
                            to="/user/requestfordonation"
                            className="btn btn-dark btn-lg px-4"
                        >
                            Report a Homeless Pet
                        </Link>
                    </div>
                </div>
            </div>

            {/* <!-- /container --> */}
            <div className="bg-light-custom block-padding">
                <div className="container">
                    <div id="counter" className="row">
                        {/* <!-- Counter --> */}
                        <div className="col-xl-3 col-md-6">
                            <div className="counter">
                                <i className="counter-icon fa fa-users"></i>
                                {/* <!-- insert your final value on data-count= --> */}
                                <div className="counter-value" data-count="30">
                                    0
                                </div>
                                <h3 className="title">Happy Clients</h3>
                            </div>
                            {/* <!-- /counter --> */}
                        </div>
                        {/* <!-- /col-lg --> */}
                        {/* <!-- Counter --> */}
                        <div className="col-xl-3 col-md-6">
                            <div className="counter">
                                <i className="counter-icon flaticon-dog-in-front-of-a-man"></i>
                                {/* <!-- insert your final value on data-count= --> */}
                                <div className="counter-value" data-count="14">
                                    0
                                </div>
                                <h3 className="title">Professionals</h3>
                            </div>
                            {/* <!-- /counter --> */}
                        </div>
                        {/* <!-- /col-lg --> */}
                        {/* <!-- Counter --> */}
                        <div className="col-xl-3 col-md-6">
                            <div className="counter">
                                <i className="counter-icon flaticon-dog-2"></i>
                                {/* <!-- insert your final value on data-count= --> */}
                                <div className="counter-value" data-count="30">
                                    0
                                </div>
                                <h3 className="title">Adopted Pets</h3>
                            </div>
                            {/* <!-- /counter --> */}
                        </div>
                        {/* <!-- /col-lg --> */}
                        {/* <!-- Counter --> */}
                        <div className="col-xl-3 col-md-6">
                            <div className="counter">
                                <i className="counter-icon flaticon-prize-badge-with-paw-print"></i>
                                {/* <!-- insert your final value on data-count= --> */}
                                <div className="counter-value" data-count="12">
                                    0
                                </div>
                                <h3 className="title">Prizes</h3>
                            </div>
                            {/* <!-- /counter --> */}
                        </div>
                        {/* <!-- /col-lg --> */}
                    </div>
                    {/* <!-- /row --> */}
                </div>
                {/* <!-- /container --> */}
            </div>
            <hr/>
            <br/>
            <br/>

            <div className="container">
                <div className="section-heading text-center">
                    <h2>About Us</h2>
                </div>
                {/* <!-- /Section-heading --> */}
            </div>
            {/* <!-- /container --> */}
            <div className="container block-padding pt-0">
                <div className="row">
                    <div className="col-lg-6 my-auto">
                        <h3>Dedicated to Pet Adoption</h3>
                        <p>
                            We are committed to connecting pets in need with loving families.
                            Each adoption journey is unique, and we are here to provide
                            support, resources, and guidance to make the process as smooth as
                            possible for you and your new pet.
                        </p>
                        <p>
                            Our goal is to create lasting, happy bonds between pets and owners
                            by carefully matching each pet’s personality and needs with a
                            compatible family. We believe every pet deserves a safe, caring
                            home.
                        </p>
                        <ul className="custom ps-0">
                            <li>
                                Comprehensive support and resources to guide you through the
                                adoption process.
                            </li>
                            <li>
                                Personalized matching to help find the perfect pet for your home
                                and lifestyle.
                            </li>
                            <li>
                                A compassionate commitment to every pet's well-being and
                                happiness.
                            </li>
                        </ul>
                        {/* <!-- /ul --> */}
                    </div>
                    {/* <!-- image --> */}
                    <div className="col-lg-6">
                        <img
                            src="/assets/img/about2.jpg"
                            alt="Pet adoption services"
                            className="img-fluid border-irregular1"
                            data-aos="zoom-in"
                        />
                    </div>
                </div>
                {/* <!-- /row --> */}
            </div>
            <div className="container">
                <div className="row res-margin mt-5 ">
                    <div className="col-lg-6 mt-5">
                        <div className="contact-icon">
                            {/* <!---icon--> */}
                            <i className="fa fa-envelope top-icon"></i>
                            {/* <!-- contact-icon info--> */}
                            <div className="contact-icon-info">
                                <h5>Send us a Message</h5>
                                <p className="h7">
                                    <a href="mailto:email@yoursite.com">woofemail@yoursite.com</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /contact-icon--> */}
                    <div className="col-lg-6 mt-5">
                        <div className="contact-icon">
                            {/* <!---icon--> */}
                            <i className="fa fa-map-marker top-icon"></i>
                            {/* <!-- contact-icon info--> */}
                            <div className="contact-icon-info">
                                <h5>Visit our Location</h5>
                                <p className="h7">Pet Street 123 - New Amritsar</p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /contact-icon--> */}
                    <div className="col-lg-6 mt-5">
                        <div className="contact-icon">
                            {/* <!---icon--> */}
                            <i className="fa fa-phone top-icon"></i>
                            {/* <!-- contact-icon info--> */}
                            <div className="contact-icon-info">
                                <h5>Call us today</h5>
                                <p className="h7">(123) 456-789</p>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /contact-icon--> */}
                    <div className="col-lg-6 mt-5">
                        <div className="contact-icon">
                            {/* <!---icon--> */}
                            <i className="fa fa-heart top-icon"></i>
                            {/* <!-- contact-icon info--> */}
                            <div className="contact-icon-info">
                                <h5>Follow us on Social Media</h5>
                                <ul className="social-media">
                                    <li>
                                        <a href="#">
                                            <i className="fab fa-facebook-square"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="fab fa-pinterest"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /contact-icon--> */}
                </div>
            </div>
        </>
    );
}

export default UserDashboard;
