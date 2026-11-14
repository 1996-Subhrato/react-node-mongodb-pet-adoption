const Footer = () => {
    return (
        <>
            {/* ==== Footer ==== */}
            <footer className="text-light">
                <div className="container">
                    <div className="row">
                        {/* Brand and Description */}
                        <div className="col-lg-6">
                            <a className="navbar-brand" href="/">
                                <i className="flaticon-dog-20"></i>
                                <span>Woof!</span>
                            </a>
                            <p className="mt-3">
                                At Woof!, we believe every pet deserves a loving home. Our goal is to connect
                                pets with their forever families, bringing joy and companionship into their lives.
                                Join us in making a difference, one adoption at a time.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="col-lg-3">
                            <h6>
                                <i className="fas fa-envelope margin-icon"></i>Contact Us
                            </h6>
                            <ul className="list-unstyled">
                                <li>+91 12345 67890</li>
                                <li>
                                    <a href="mailto:email@yoursite.com">woofemail@yoursite.com</a>
                                </li>
                                <li>Pet Street 123 - New Amritsar</li>
                            </ul>
                        </div>

                        {/* Working Hours */}
                        <div className="col-lg-3">
                            <h6>
                                <i className="far fa-clock margin-icon"></i>Working Hours
                            </h6>
                            <ul className="list-unstyled">
                                <li>Monday - Friday: 9am - 10pm</li>
                                <li>Weekends: Closed</li>
                                <li>Holidays: Closed</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Credits */}
                    {/*<div className="row">*/}
                    {/*    <div className="credits col-sm-12">*/}
                    {/*        <p>*/}
                    {/*            Built with dedication by{" "}*/}
                    {/*            <a href="http://www.harleydavidson.com/" target="_blank" rel="noopener noreferrer">*/}
                    {/*                Jashanpreet Singh*/}
                    {/*            </a>*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                {/* Back to Top Link */}
                <div className="d-none d-md-block">
                    <a href="#top" className="back-to-top">
                        <i className="fa fa-angle-up"></i>
                    </a>
                </div>
            </footer>
        </>
    );
};

export default Footer;
