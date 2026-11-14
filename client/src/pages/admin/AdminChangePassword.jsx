import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Server_URL } from "../../utils/config";
// import { useNavigate } from "react-router-dom";
import { utilityFunctions } from "../../utils/module";
// import { Link } from "react-router-dom";
import { toast } from "react-toastify";
function AdminChangePassword() {
//   const navigate = useNavigate();
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
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "admin-changepassword";
      const response = await axios.post(url, data,{
        headers: {
            Authorization: `Bearer ${token}` 
        }
      });
      const { error, message} = response.data;
      console.log(response.data);
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
        // const {token} = response.data;
        // console.log(token)
        // alert(message);
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
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setFocus("password");
    // getAdminData();
  }, []);

  return (
    <>
      <div className="container py-5">
        <h3 style={{textAlign:'center'}}>Admin Change Password</h3>
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
                    <label>Current Password</label>
                    <input
                      {...register("currentpassword", { required: true })}
                      className="form-control"
                      type="password"
                      placeholder="Enter your Current Password"
                    ></input>
                    <br />
                    {errors.currentpassword && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label>New Password</label>
                    <input
                      {...register("newpassword", { required: true })}
                      className="form-control"
                      type="password"
                      placeholder="Enter your New Password"
                    ></input>
                    <br />
                    {errors.newpassword && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label>Confirm Password</label>
                    <input
                      {...register("confirmpassword", { required: true })}
                      className="form-control"
                      type="password"
                      placeholder="Confirm your New Password"
                    ></input>
                    <br />
                    {errors.confirmpassword && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>

                  

                  <button className="btn btn-warning mt-2">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AdminChangePassword;
