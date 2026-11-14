import { useForm } from "react-hook-form";
import axios from "axios";
// import { useState, useEffect, useContext } from "react";
import { Server_URL } from "../../utils/config";
// import { useNavigate } from "react-router-dom";
import { utilityFunctions } from "../../utils/module";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const RequestDonation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    try {
      // console.log(data.photo[0]);
      // console.log(data);
      const token = utilityFunctions.getCookieValue("userAuthToken");
      const url = Server_URL + "reportfound-pet";
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { error, message } = response.data;
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
  return (
    <>
    {/* Jumbotron */}
    <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          {/* Section Heading */}
          <div className="section-heading" data-aos="zoom-in">
            <h1>Homeless Pet Report Form</h1>
          </div>
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/user/userdashboard">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
              Homeless Pet Report Form
              </li>
            </ol>
          </nav>
        </div>
      </div>
    <div className="container py-5">
      {/* <h3 style={{ textAlign: "center" }}>Homeless Pet Report Form</h3> */}

      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card shadow-lg">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h5>#About Pet</h5>
                {/* Pet Type and Gender */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Pet Type</label>
                    <select
                      {...register("petType", { required: true })}
                      className="form-control"
                    >
                      <option value="">Select Pet Type</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.petType && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label>Gender</label>
                    <select
                      {...register("petGender", { required: true })}
                      className="form-control"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                    {errors.petGender && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                </div>
                {/* Pet Description */}
                {/* Location Found, Date Found, and Time Found */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Location Found</label>
                    <input
                      {...register("locationFound", { required: true })}
                      className="form-control"
                      type="text"
                      placeholder="Include a street name, landmark,etc."
                    />
                    {errors.locationFound && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                  <div className="col-md-3">
                    <label>Date Found</label>
                    <input
                      {...register("dateFound", { required: true })}
                      className="form-control"
                      type="date"
                    />
                    {errors.dateFound && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                  <div className="col-md-3">
                    <label>Time Found</label>
                    <input
                      {...register("timeFound", { required: true })}
                      className="form-control"
                      type="time"
                    />
                    {errors.timeFound && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                </div>
                {/* Behavior, Weather, and Color */}
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label>Behavior/Temperament</label>
                    <select
                      {...register("petBehavior", { required: true })}
                      className="form-control"
                    >
                      <option value="">Select Behavior</option>
                      <option value="Friendly">Friendly</option>
                      <option value="Aggressive">Aggressive</option>
                      <option value="Timid">Timid</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.petBehavior && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label>Weather Conditions</label>
                    <select
                      {...register("weatherCondition", { required: true })}
                      className="form-control"
                    >
                      <option value="">Select Weather</option>
                      <option value="Sunny">Sunny</option>
                      <option value="Rainy">Rainy</option>
                      <option value="Snowy">Snowy</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.weatherCondition && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                  {/* <div className="row mb-3"> */}
                    <div className="col-md-4">
                      <label>Pet's Color or Markings</label>
                      <input
                        {...register("petColor", { required: true })}
                        className="form-control"
                        type="text"
                        placeholder="e.g., Black with white spots"
                      />
                      {errors.petColor && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  {/* </div> */}

                  {/* Nearest Shelter Notified */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>• Nearest Shelter/Authority Notified?</label>
                      <div className="form-check">
                        <input
                          {...register("shelterNotified", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="shelterNotified"
                          value="Yes"
                        />
                        <label className="form-check-label">Yes</label>
                      </div>
                      <div className="form-check">
                        <input
                          {...register("shelterNotified", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="shelterNotified"
                          value="No"
                        />
                        <label className="form-check-label">No</label>
                      </div>
                      {errors.shelterNotified && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label>• Size of the Pet</label>
                      <div className="form-check">
                        <input
                          {...register("petSize", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="petSize"
                          value="Small"
                        />
                        <label className="form-check-label">Small</label>
                      </div>
                      <div className="form-check">
                        <input
                          {...register("petSize", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="petSize"
                          value="Medium"
                        />
                        <label className="form-check-label">Medium</label>
                      </div>
                      <div className="form-check">
                        <input
                          {...register("petSize", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="petSize"
                          value="Large"
                        />
                        <label className="form-check-label">Large</label>
                      </div>
                      {errors.petSize && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>• Pet's Activity or Movement</label>
                      <div className="form-check">
                        <input
                          {...register("petActivity", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="petActivity"
                          value="Wandering in the area"
                        />
                        <label className="form-check-label">
                          Wandering in the area
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          {...register("petActivity", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="petActivity"
                          value="Sitting at one spot"
                        />
                        <label className="form-check-label">
                          Sitting at one spot
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          {...register("petActivity", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="petActivity"
                          value="Other"
                        />
                        <label className="form-check-label">Other</label>
                      </div>
                      {errors.petActivity && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label>• Any Immediate Action Taken?</label>
                      <div className="form-check">
                        <input
                          {...register("immediateAction", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="immediateAction"
                          value="Provided food"
                        />
                        <label className="form-check-label">
                          Provided food
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          {...register("immediateAction", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="immediateAction"
                          value="Called animal rescue"
                        />
                        <label className="form-check-label">
                          Called animal rescue
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          {...register("immediateAction", { required: true })}
                          className="form-check-input"
                          type="radio"
                          name="immediateAction"
                          value="Other"
                        />
                        <label className="form-check-label">Other</label>
                      </div>
                      {errors.immediateAction && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                   {/* Pet's Condition */}
                {/* <div className="col-md-6 mb-3"> */}
                  <div className="col-md-12">
                  <label>Pet’s Condition</label>
                  <select
                    {...register("petCondition", { required: true })}
                    className="form-control"
                  >
                    <option value="">Select Condition</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Injured">Injured</option>
                    <option value="Malnourished">Malnourished</option>
                    <option value="Sick">Sick</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.petCondition && (
                    <p className="text-danger">This field is required</p>
                  )}
                  {/* </div> */}
                </div>
                {/* <div className="col-md-6">
                      <label>Upload Pet Photo (Optional)</label>
                      <input
                        {...register("petImage")}
                        type="file"
                        className="form-control"
                        accept="image/*"
                      />
                    </div> */}

                </div>

               
                <hr />
                <h5>#Informer's Details</h5>
                {/* Contact Details */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Your Name</label>
                    <input
                      {...register("reporterName", { required: true })}
                      className="form-control"
                      type="text"
                      placeholder="Enter your name"
                    />
                    {errors.reporterName && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label>Phone Number</label>
                    <input
                      {...register("contactNumber", { required: true })}
                      className="form-control"
                      type="text"
                      placeholder="Enter your contact number"
                    />
                    {errors.contactNumber && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                </div>
                {/* Home Address */}
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label>Home Address</label>
                    <textarea
                      {...register("homeAddress", { required: true })}
                      className="form-control"
                      rows="2"
                      placeholder="Enter your home address (e.g., street name, city, state)"
                    ></textarea>
                    {errors.homeAddress && (
                      <p className="text-danger">This field is required</p>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label>Email Address (Optional)</label>
                    <input
                      {...register("email")}
                      className="form-control"
                      type="email"
                      placeholder="Enter your email (optional)"
                    />
                  </div>
                </div>
                {/* Additional Notes */}
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label>Additional Notes (Optional)</label>
                    <textarea
                      {...register("additionalNotes")}
                      className="form-control"
                      rows="3"
                      placeholder="Add any extra information about the pet or its behavior."
                    ></textarea>
                  </div>
                </div>
                <div className="container py-3">
                  <div
                    style={{
                      backgroundColor: "#f8d7da",
                      border: "1px solid #f5c6cb",
                      borderRadius: "5px",
                      padding: "15px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: "#721c24", margin: 0 }}>
                      ⚠️ Please ensure the pet is kept in the{" "}
                      <strong>safest place</strong> or at your
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {" "}
                        home
                      </span>
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        (if possible){" "}
                      </span>
                      until we Contact and Reach you!
                    </p>
                  </div>
                </div>
                {/* Submit Button */}
                <div className="row">
                  <div className="col-md-12 text-center">
                    <button type="submit" className="btn btn-primary mt-3">
                      Submit Report
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default RequestDonation;
