import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { Server_URL } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UserResetPassword() {
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
       // Retrieve the email from local storage
       const email = localStorage.getItem("email");

       // Merge email with password data
       const requestData = {
         email,
         newpassword: data.newpassword,
         confirmpassword: data.confirmpassword,
       };
      const url = Server_URL + "user-reset-password";
      const response = await axios.post(url, requestData);
      const { error, message } = response.data;

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
        // alert(message);
        localStorage.removeItem("email");
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
        navigate("/usersignin");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setFocus("newpassword");
  }, []);

  return (
    <div className="container py-5">
      <h3 style={{ textAlign: 'center' }}>Reset Password</h3>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-lg">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label>New Password</label>
                  <input
                    {...register("newpassword", { required: true })}
                    className="form-control"
                    type="password"
                    placeholder="Enter your New Password"
                  />
                  <br />
                  {errors.newpassword && <p className="text-danger">This field is required</p>}
                </div>
                <div className="mb-3">
                  <label>Confirm Password</label>
                  <input
                    {...register("confirmpassword", { required: true })}
                    className="form-control"
                    type="password"
                    placeholder="Confirm your New Password"
                  />
                  <br />
                  {errors.confirmpassword && <p className="text-danger">This field is required</p>}
                </div>
                <button className="btn btn-warning mt-2">Reset Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default UserResetPassword;
