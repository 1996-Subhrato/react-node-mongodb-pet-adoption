import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {utilityFunctions} from "../utils/module";
import {Server_URL} from "../utils/config";

function Home() {
    const [admins, setAdmins] = useState([]);

    // Fetch admin data
    async function getAdminData() {
        try {
            const url = Server_URL + "get-ourteam";
            const response = await axios.get(url);
            const {result} = response.data;

            if (result) {
                // console.log("Fetched Admins:", result);

                setAdmins(result.slice(0, 3));
            } else {
                console.log("No admin data found.");
            }
        } catch (error) {
            console.error("Error fetching admin data:", error.message);
        }
    }

    useEffect(() => {
        getAdminData();
    }, []);

    return (
        <>
            <div id="top">
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        height: "800px",
                        margin: "0 auto",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Background image */}
                    <img
                        src="/assets/img/slide1.jpg"
                        alt=""
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
                                    Search our list of dogs, cats and other pets available for
                                    adoption near you
                                </p>
                                <Link
                                    className="btn btn-primary"
                                    to="/usersignin"
                                    style={{
                                        marginTop: "10px",
                                        backgroundColor: "#007bff", // Bootstrap primary color
                                        color: "white",
                                        padding: "10px 20px",
                                        textDecoration: "none",
                                        borderRadius: "5px",
                                    }}
                                >
                                    SignIn & Adopt
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sign In and Registration Section */}
                <section id="auth-buttons" className="auth-section pt-5 pb-5 cat-bg2">
                    <div className="container section-heading text-center mt-5">
                        <h2>Join Us Today</h2>
                        <h6>Sign in or register to manage your account and Adopt a Pet!</h6>

                        <div className="auth-buttons mt-4">
                            {/* Sign In Button */}
                            <Link
                                to="/usersignin"
                                className="btn btn-primary mx-2"
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    textDecoration: "none",
                                    borderRadius: "5px",
                                }}
                            >
                                Sign In
                            </Link>

                            {/* Registration Button */}
                            <Link
                                to="/manageuser"
                                className="btn btn-secondary mx-2"
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    textDecoration: "none",
                                    borderRadius: "5px",
                                }}
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </section>


                {/* <!-- ==== Page Content ==== --> */}
                {/* <!-- Section services --> */}
                <div className="container section-heading">
                    <h2 className="text-center fw-bold ">Our Team</h2>
                    <div className="row mt-4">
                        {admins.map((admin, index) => (
                            <div key={index} className="col-lg-4 col-md-6 mb-4">
                                <div className="card shadow" style={{backgroundColor: '#FCFAF3'}}>
                                    <div className="card-body text-center">
                                        {/* Admin Name */}
                                        <h4 className="card-title fw-bold"
                                            style={{color: 'maroon'}}>{admin.fullName}</h4>
                                        {/* Email */}
                                        <p className="card-text text-muted mb-1">
                                            <strong>Email:</strong> {admin.email}
                                        </p>
                                        {/* Mobile */}
                                        <p className="card-text text-muted mb-1">
                                            <strong>Mobile:</strong> {admin.mobile}
                                        </p>
                                        {/* Role */}
                                        {/*<p className="card-text text-muted">*/}
                                        {/*    <strong>Role:</strong> <span style={{color: 'blue'}}>{admin.userRole}</span>*/}
                                        {/*</p>*/}
                                        {/* Address */}
                                        {/*<p className="card-text">*/}
                                        {/*    <strong>Address:</strong> {admin.address}*/}
                                        {/*</p>*/}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <section id="services" className="cat-bg3">
                    <div className="container">
                        <div className="section-heading text-center">
                            <h2>Our Services</h2>
                        </div>
                        {/* Section Heading */}
                        <div className="container block-padding pt-0">
                            <div className="row">
                                <div className="col-xl-6 my-auto">
                                    <h3>The Best Care for Adopted Pets</h3>
                                    <p>
                                        Finding the right forever home is our goal, and we’re here
                                        to support you through every step of adoption. Our adoption
                                        services ensure each pet is healthy, vaccinated, and ready
                                        for their new family.
                                    </p>
                                    <p>
                                        <strong>
                                            We focus on responsible adoption, providing resources and
                                            guidance to help every pet find a safe and loving
                                            environment.
                                        </strong>
                                    </p>
                                    {/* Custom list */}
                                    <ul className="custom ps-0">
                                        <li>Complete pet health check-ups and vaccinations.</li>
                                        <li>
                                            Guidance on adjusting and caring for your adopted pet at
                                            home.
                                        </li>
                                        <li>Resources for behavior training and socialization.</li>
                                    </ul>
                                </div>

                                {/* Image Section */}
                                <div className="col-xl-6">
                                    <img
                                        src="/assets/img/services2.jpg"
                                        alt="Caring for pets"
                                        data-aos="fade-down"
                                        data-aos-duration="1500"
                                        className="img-fluid border-irregular1 border-double"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* <!-- /bg-light-custom -->  */}
                    </div>
                    {/* <!-- /container --> */}
                </section>
                <br/>
                <br/>
                <br/>
                <br/>
                {/* <!-- / Section Ends --> */}

                {/* <!-- Section Blurb --> */}
                <section id="blurb" className="bg-primary text-light">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-8 position-relative">
                                {/* <!-- image  --> */}
                                <img
                                    src="/assets/img/blurbimg.png"
                                    className="img-fluid blurb-img"
                                    alt=""
                                />
                            </div>
                            <div className="col-xl-4 my-auto" data-aos="fade-down">
                                <h2 className="res-margin">Join our Adoption Community</h2>
                                <p className="featured-text">
                                    Become part of a caring network dedicated to giving pets a
                                    second chance at life. Our adoption services connect you with
                                    pets in need of loving homes, offering guidance, resources,
                                    and support to make the adoption process smooth and rewarding.
                                    Let's make a difference, one adoption at a time.
                                </p>
                                {/* <!-- button --> */}
                                <Link to="/maincontact" className="btn btn-primary">
                                    Contact Us
                                </Link>
                            </div>
                            {/* <!-- /col-lg --> */}
                        </div>
                        {/* <!-- /row --> */}
                    </div>
                    {/* <!-- /container --> */}
                </section>

                {/* <!-- SVG effect --> */}
                <svg
                    id="bigTriangleColor"
                    className="d-none d-sm-block"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="100%"
                    height="100"
                    viewBox="0 0 100 102"
                    preserveAspectRatio="none"
                >
                    <path d="M0 0 L50 100 L100 0 Z"/>
                </svg>
                {/* <!-- / Section Ends --> */}

                {/* <!-- Section About Us --> */}
                <section id="about" className="dog-bg2">
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
                                    We are committed to connecting pets in need with loving
                                    families. Each adoption journey is unique, and we are here to
                                    provide support, resources, and guidance to make the process
                                    as smooth as possible for you and your new pet.
                                </p>
                                <p>
                                    Our goal is to create lasting, happy bonds between pets and
                                    owners by carefully matching each pet’s personality and needs
                                    with a compatible family. We believe every pet deserves a
                                    safe, caring home.
                                </p>
                                <ul className="custom ps-0">
                                    <li>
                                        Comprehensive support and resources to guide you through the
                                        adoption process.
                                    </li>
                                    <li>
                                        Personalized matching to help find the perfect pet for your
                                        home and lifestyle.
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

                    {/* <!-- /container --> */}
                    <div className="bg-light-custom block-padding">
                        <div className="container">
                            <div id="counter" className="row">
                                {/* <!-- Counter --> */}
                                <div className="col-xl-3 col-md-6">
                                    <div className="counter">
                                        <i className="counter-icon fa fa-users"></i>
                                        {/* <!-- insert your final value on data-count= --> */}
                                        <div className="counter-value" data-count="1500">
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
                                        <div className="counter-value" data-count="900">
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
                </section>
                {/* <!-- / Section Ends --> */}

                <div className="container">
                    {/* <!-- /row--> */}
                    <div className="row res-margin mt-5">
                        <div className="col-lg-6 mt-5">
                            <div className="contact-icon">
                                {/* <!---icon--> */}
                                <i className="fa fa-envelope top-icon"></i>
                                {/* <!-- contact-icon info--> */}
                                <div className="contact-icon-info">
                                    <h5>Send us a Message</h5>
                                    <p className="h7">
                                        <a href="mailto:email@yoursite.com">email@yoursite.com</a>
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
                                    <p className="h7">Pet Street 123 - New York</p>
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
                    {/* <!-- /row --> */}
                </div>
                {/* <!-- /container -->  */}
                {/* </section> */}
                {/* <!-- /Section ends --> */}
            </div>
        </>
    );
}

export default Home;
