import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav id="main-nav" className="navbar-expand-xl">
        {/* Top Bar */}
        <div className="container-fluid top-bar">
          <div className="container">
            <div className="row">
              <div className="col-md-9">
                {/* <!-- Start Contact Info --> */}
                <ul className="contact-details float-left">
                  <li><i className="fa fa-map-marker"></i>Pet Street 123 - New Amritsar</li>
                  <li><i className="fa fa-envelope"></i><a href="mailto:email@site.com">woofemail@yoursite.com</a></li>
                  <li><i className="fa fa-phone"></i>+91 12345 67890</li>
                </ul>
                {/* <!-- End Contact Info --> */}
              </div>
              {/* <!-- /col --> */}
              <div className="col-md-3">
                {/* <!-- Start Social Links --> */}
                <ul className="social-list float-right list-inline">
                  <li className="list-inline-item"><a title="Facebook" href="#"><i className="fab fa-facebook-f"></i></a></li>
                  <li className="list-inline-item"><a title="Twitter" href="#"><i className="fab fa-twitter"></i></a></li>
                  <li className="list-inline-item"><a title="Instagram" href="#"><i className="fab fa-instagram"></i></a></li>
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
            {/* Logo */}
            <Link className="navbar-brand" to="/">
              <i className="flaticon-dog-20"></i><span>Woof!</span>
            </Link>

            {/*  Navbar Toggler */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggle-icon">
                <i className="fas fa-bars"></i>
              </span>
            </button>

            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link home" to="/">Home</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link home" to="/mainabout">About Us</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link home" to="/maincontact">Contact Us</Link>
                </li>

                <li className="nav-item dropdown">
                  <Link className="nav-link dropdown-toggle" to="#" id="signin-dropdown" data-bs-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                    Customer
                  </Link>
                  <div className="dropdown-menu" aria-labelledby="signin-dropdown">
                    <Link className="dropdown-item" to="/usersignin">SignIn</Link>
                    <Link className="dropdown-item" to="/manageuser">Create Account</Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
