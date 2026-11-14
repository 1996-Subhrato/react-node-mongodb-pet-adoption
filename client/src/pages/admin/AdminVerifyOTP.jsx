import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { Server_URL } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminVerifyOTP() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm();

  async function onSubmit(data) {
    try {
      // Retrieve the email from local storage
      const email = localStorage.getItem("email");

      // Merge email with OTP data
      const requestData = { email, otp: data.otp };
      const url = Server_URL + "admin-verify-otp";
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
        navigate("/adminresetpassword");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    setFocus("otp");
  }, []);

  return (
    <div className="container py-5">
      <h3 style={{ textAlign: "center" }}>Verify OTP</h3>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-lg">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label>Enter OTP</label>
                  <input
                    {...register("otp", { required: true })}
                    className="form-control"
                    type="text"
                    placeholder="Enter the OTP sent to your email"
                  />
                  <br />
                  {errors.otp && (
                    <p className="text-danger">This field is required</p>
                  )}
                </div>
                <button className="btn btn-warning mt-2">Verify OTP</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminVerifyOTP;
