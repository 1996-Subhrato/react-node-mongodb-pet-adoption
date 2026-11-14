import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Server_URL } from "../../utils/config";
import {utilityFunctions} from "../../utils/module";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

function AdminSignIn() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm();

  async function onSubmit(data) {
    try {
      // console.log(data);
      const url = Server_URL + "admin-signin";
      const response = await axios.post(url, data);
      const { error, message,token } = response.data;
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
        const {token} = response.data;
        // console.log(token)
        // alert(message);
       
          // Wait for the toast to appear before proceeding with state changes
          setTimeout(() => {
            reset(); // Reset the form
            utilityFunctions.setCookie('adminAuthToken', token, 1); // Store token in a cookie
            navigate("/admin/admindashboard"); // Redirect to dashboard
          }, 3000); // Delay for 500ms to ensure the toast displays
        
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setFocus("email");
    // getAdminData();
  }, []);

  return (
    <>
      <div className="container py-5">
        <h3 style={{textAlign:'center'}}>Admin SignIn</h3>
        <div className="row">
          <div className="col-md-8 offset-md-2 ">
            <div className="card shadow-lg">
              {/* <div
                className="card-header text-dark py-2"
                style={{ backgroundColor: "#FDCA40" }}
              >
                Admin Sign-In
              </div> */}

              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* <form> */}

                  <div className="mb-3">
                    <label>Email</label>
                    <input
                      {...register("email", { required: true })}
                      className="form-control"
                      type="email"
                      placeholder="Enter your Email"
                    ></input>
                    <br />
                    {errors.email && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label>Password</label>
                    <input
                      {...register("password", { required: true })}
                      className="form-control"
                      type="password"
                      placeholder="Enter your Password"
                    ></input>
                    <br />
                    {errors.password && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>

                  <div className="d-flex justify-content-between">
                  <button className="btn btn-warning mt-2">Sign In</button>

                  
                  <Link className="btn btn-danger mt-2" to="/adminforgetpassword">
                    Forget password?
                  </Link>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminSignIn;
