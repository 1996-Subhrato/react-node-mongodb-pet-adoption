import {Link, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import {utilityFunctions} from "../utils/module";
import {HiOutlineLogout} from "react-icons/hi";

const AdminNavbar = () => {
    const navigate = useNavigate(); // For navigation

    // Logout function
    const adminLogout = (e) => {
        e.preventDefault();

        // Remove authentication tokens or other necessary logout actions
        utilityFunctions.removeCookie("adminAuthToken");
        localStorage.removeItem("adminAuthToken"); // Optional if you're using cookies only
        window.dispatchEvent(new Event("storage"));
        // Show logout toast message
        toast.success("Admin!, You have been Logged Out!!");

        // Set timeout of 3 seconds before navigating to the homepage
        setTimeout(() => {
            navigate("/adminsignin"); // Navigate to the homepage after 3 seconds
        }, 3000);
    };
    return (
        <>
            <ToastContainer/>
            <nav id="main-nav" className="navbar-expand-xl">
                {/* <!-- Top Bar --> */}
                <div className="container-fluid top-bar">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-9">
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
                                        <i className="fa fa-phone"></i>+91 12345 67890
                                    </li>
                                </ul>
                            </div>

                            <div className="col-md-3">
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
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navbar */}
                <div className="navbar container-fluid">
                    <div className="container">
                        {/* <!-- logo --> */}
                        <Link className="navbar-brand" to="/admin/admindashboard">
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
                                <li className="nav-item">
                                    <Link className="nav-link home" to="/admin/admindashboard">
                                        Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="#" id="services-dropdown"
                                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    >
                                        Admin
                                    </Link>
                                    <div className="dropdown-menu" aria-labelledby="services-dropdown">
                                        <Link className="dropdown-item" to="/admin/manageadmin">
                                            Add Admin
                                        </Link>

                                        <Link className="dropdown-item" to="/admin/viewadmin">
                                            View Admin
                                        </Link>
                                    </div>
                                </li>

                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="#" id="services-dropdown"
                                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    >
                                        Manage Category/Breeds
                                    </Link>
                                    <div className="dropdown-menu" aria-labelledby="services-dropdown">
                                        <Link className="dropdown-item" to="/admin/managecategory">
                                            Add Category
                                        </Link>

                                        <Link className="dropdown-item" to="/admin/viewcategory">
                                            View Category
                                        </Link>

                                        <Link className="dropdown-item" to="/admin/managesubcategory">
                                            Add Breed
                                        </Link>

                                        <Link className="dropdown-item" to="/admin/viewsubcategory">
                                            View Breeds
                                        </Link>
                                    </div>
                                </li>

                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="#" id="services-dropdown"
                                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    >
                                        Manage Pets
                                    </Link>
                                    <div className="dropdown-menu" aria-labelledby="services-dropdown">
                                        <Link className="dropdown-item" to="/admin/managepets">
                                            Add Pets
                                        </Link>

                                        <Link className="dropdown-item" to="/admin/viewpets">
                                            View Pets
                                        </Link>
                                    </div>
                                </li>

                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="#" id="requests-dropdown"
                                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    >
                                        Adoption Requests
                                    </Link>
                                    <div className="dropdown-menu" aria-labelledby="requests-dropdown">
                                        <Link className="dropdown-item" to="/admin/pendingrequests">
                                            Pending+Confirmed
                                        </Link>
                                    </div>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link home" to="/admin/feedback">
                                        Feedbacks
                                    </Link>
                                </li>

                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="#" id="requests-dropdown"
                                          data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                    >
                                        Settings
                                    </Link>
                                    <div className="dropdown-menu" aria-labelledby="requests-dropdown">
                                        <Link className="dropdown-item" to="/admin/adminchangepassword">
                                            Change Password
                                        </Link>

                                        <Link onClick={adminLogout} className="dropdown-item" to="/admin/logout">
                                            Logout <HiOutlineLogout/>
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
export default AdminNavbar;
