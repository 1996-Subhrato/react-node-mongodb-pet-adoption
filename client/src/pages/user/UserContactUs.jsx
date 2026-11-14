import React, { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Server_URL } from "../../utils/config";
const UserContactUs= ()=>{
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setFocus,
      } = useForm(); 
    
     async function onSubmit(data){
      try{
        console.log(data);
        // return false
        const url = Server_URL + "contact-us";
        const response = await axios.post(url,data);
        // console.log(response.data);
        const{error,message} = response.data;
        if(error){
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
        }
        else{
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
        }
      }
      catch(e){
        console.log(e);
      }
     }
    //  useEffect(() => {
    //   setFocus("name");
    // });
    return(
        <>
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          {/* Section Heading */}
          <div className="section-heading" data-aos="zoom-in">
            <h1>Contact Us</h1>
          </div>
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/user/userdashboard">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Contact Us
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="page">
        <div className="container">
          <div className="row">
            {/* Contact Info - Full Width */}
            <div className="contact-info col-lg-12 card bg-light-custom">
              <h4>Send us a message!</h4>
              {/* Form Starts */}
              <form id="contact_form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-6">
                      <label>
                        Name<span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: true })}
                        className="form-control input-field"
                      />
                      {errors.name && <p className="text-danger">Name is required</p>}
                    </div>
                    <div className="col-md-6">
                      <label>
                        Email Address <span className="required">*</span>
                      </label>
                      <input
                        type="email"
                        {...register("email", { required: true })}
                        className="form-control input-field"
                      />
                      {errors.email && <p className="text-danger">Email is required</p>}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label>Subject</label>
                      <input
                        type="text"
                        {...register("subject", {required:true})}
                        className="form-control input-field"
                      />
                      {errors.subject && <p className="text-danger">Subject is required</p>}
                    </div>
                    <div className="col-md-12">
                      <label>
                        Message<span className="required">*</span>
                      </label>
                      <textarea
                        {...register("message", { required: true })}
                        className="textarea-field form-control"
                        rows="3"
                      ></textarea>
                      {errors.message && <p className="text-danger">Message is required</p>}
                    </div>
                  </div>
                  <button
                    type="submit"
                    id="submit_btn"
                    className="btn btn-primary"
                  >
                    Send message
                  </button>
                </div>
                {/* Contact results */}
                <div id="contact_results"></div>
              </form>
            </div>
          </div>
          
          {/* Contact Icons */}
          <div className="row res-margin mt-5">
            <div className="col-lg-6 mt-5">
              <div className="contact-icon">
                {/* Icon */}
                <i className="fa fa-envelope top-icon"></i>
                {/* Contact Icon Info */}
                <div className="contact-icon-info">
                  <h5>Send us a Message</h5>
                  <p className="h7">
                    <Link to="mailto:email@yoursite.com">woofemail@yoursite.com</Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mt-5">
              <div className="contact-icon">
                {/* Icon */}
                <i className="fa fa-map-marker top-icon"></i>
                {/* Contact Icon Info */}
                <div className="contact-icon-info">
                  <h5>Visit our Location</h5>
                  <p className="h7">Pet Street 123 - New Amritsar</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mt-5">
              <div className="contact-icon">
                {/* Icon */}
                <i className="fa fa-phone top-icon"></i>
                {/* Contact Icon Info */}
                <div className="contact-icon-info">
                  <h5>Call us today</h5>
                  <p className="h7">(123) 456-789</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mt-5">
              <div className="contact-icon">
                {/* Icon */}
                <i className="fa fa-heart top-icon"></i>
                {/* Contact Icon Info */}
                <div className="contact-icon-info">
                  <h5>Follow us on Social Media</h5>
                  <ul className="social-media">
                    <li>
                      <Link to="#">
                        <i className="fab fa-facebook-square"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-instagram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-twitter"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <i className="fab fa-pinterest"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    )
}
export default UserContactUs;