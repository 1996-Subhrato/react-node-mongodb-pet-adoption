import {Link, useNavigate} from "react-router-dom";
import {utilityFunctions} from "../utils/module";
import {ToastContainer, toast} from "react-toastify";
import {HiOutlineLogout} from "react-icons/hi";

const UserNavbar = () => {
    const navigate = useNavigate();

    function userlogout(e) {
        e.preventDefault();
        utilityFunctions.removeCookie("userAuthToken");
        localStorage.removeItem("userAuthToken"); // Optional if you're using cookies only
        window.dispatchEvent(new Event("storage")); // Dispatches a storage event to trigger re-render
        toast.success("You have been Logged Out!!, ThankYou for Visiting WOOF!"); // Show toast message
        setTimeout(() => {
            navigate("/"); // Navigate to the homepage after 3 seconds
        }, 3000);
    }

    return (
        <>
            <ToastContainer/>
            <nav id="main-nav" className="navbar-expand-xl">
                {/* Top Bar */}
                <div className="container-fluid top-bar">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9">
                                {/* <!-- Start Contact Info --> */}
                                <ul className="contact-details float-left">
                                    <li>
                                        <i className="fa fa-map-marker"></i>Pet Street 123 - New
                                        Amritsar
                                    </li>
                                    <li>
                                        <i className="fa fa-envelope"></i>
                                        <a href="mailto:email@site.com">woofemail@yoursite.com</a>
                                    </li>
                                    <li>
                                        <i className="fa fa-phone"></i>(123) 456-789
                                    </li>
                                </ul>
                                {/* <!-- End Contact Info --> */}
                            </div>
                            {/* <!-- /col --> */}
                            <div className="col-md-3">
                                {/* <!-- Start Social Links --> */}
                                <ul className="social-list float-right list-inline">
                                    <li className="list-inline-item">
                                        <a title="Facebook" href="#">
                                            <i className="fab fa-facebook-f"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a title="Twitter" href="#">
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                    </li>
                                    <li className="list-inline-item">
                                        <a title="Instagram" href="#">
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                    </li>
                                </ul>
                                {/* <!-- /End Social Links --> */}
                            </div>
                            {/* <!-- /col --> */}
                        </div>
                        {/* <!-- /row --> */}
                    </div>
                    {/* <!-- /container --> */}
                </div>

                {/* Navbar */}
                <div className="navbar container-fluid">
                    <div className="container">
                        {/* <!-- logo --> */}
                        <Link className="navbar-brand" to="/user/userdashboard">
                            <i className="flaticon-dog-20"></i>
                            <span>Woof!</span>
                        </Link>

                        {/* <!-- Navbartoggler --> */}
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarResponsive"
                            aria-controls="navbarResponsive"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                          <span className="navbar-toggle-icon">
                            <i className="fas fa-bars"></i>
                          </span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarResponsive">
                            <ul className="navbar-nav ms-auto">
                                {/* Home */}
                                <li className="nav-item">
                                    <Link className="nav-link home" to="/user/userdashboard">
                                        Home
                                    </Link>
                                </li>

                                {/* About Us */}
                                <li className="nav-item">
                                    <Link className="nav-link home" to="/user/about">
                                        About Us
                                    </Link>
                                </li>

                                {/* Contact Us */}
                                <li className="nav-item">
                                    <Link className="nav-link home" to="/user/user-contactus">
                                        Contact Us
                                    </Link>
                                </li>

                                {/* Adopt a Pet */}
                                <li className="nav-item">
                                    <Link className="nav-link home" to="/user/adoption-page">
                                        Adopt a Pet
                                    </Link>
                                </li>

                                {/* Pets Gallery */}
                                <li className="nav-item">
                                    <Link className="nav-link home" to="/user/petsgallery">
                                        Pets Gallery
                                    </Link>
                                </li>

                                {/* My Requests */}
                                <li className="nav-item">
                                    <Link className="nav-link home" to="/user/requestedpets">
                                        My Requests
                                    </Link>
                                </li>

                                {/* Settings */}
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="#" id="others-dropdown"
                                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Settings
                                    </Link>
                                    <div className="dropdown-menu" aria-labelledby="others-dropdown">
                                        <Link className="dropdown-item" to="/user/userchangepassword">
                                            Change Password
                                        </Link>

                                        <button
                                            onClick={userlogout}
                                            className="btn btn-danger btn-sm ms-2"
                                        >
                                            LogOut <HiOutlineLogout/>
                                        </button>
                                    </div>
                                </li>

                                {/* <!-- menu item --> */}
                                {/*<li className="nav-item "*/}
                                {/*    style={{backgroundColor: '#F5CB5C'}}>*/}
                                {/*    <Link className="nav-link text-dark" to="/user/requestfordonation">*/}
                                {/*        Found Homeless Pet?*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default UserNavbar;
