import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Server_URL } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import { utilityFunctions } from "../../utils/module";
// import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const AdoptionForm = () => {
  const { petId } = useParams();
  // console.log(petId)
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // setValue,
    // setFocus,
  } = useForm();
  // const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // console.log(id)
        const token = utilityFunctions.getCookieValue("userAuthToken");
        
        const response = await axios.get(Server_URL + "getUserDetails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { result } = response.data;
        // console.log(result)   
        console.log(result[0].fullName);
        // setUserData(result)

        reset({
          fullName: result[0].fullName || '',
          email: result[0].email || '',
          mobileNo1: result[0].mobile || '',
          address1: result[0].address || '',
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchUserData();
  }, [reset]);

  async function onSubmit(data) {
    try {
      // console.log(data);
      const token = utilityFunctions.getCookieValue("userAuthToken");
      const url = Server_URL + "mainAdoption-pet";
      // Add userId, petId, and set adoptionStatus to pending
      const payload = {
        ...data,
        adoptionStatus: "pending",
        petId: petId,
      };
      // console.log("Payload being sent:", payload);

      const response = await axios.post(url, payload, {
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

  return (
    <>
      <div className=" py-5">
        <h3 style={{ textAlign: "center" }}>Adoption Form</h3>
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <div className="card shadow-lg">
              <div className="card-body">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h6 style={{ textDecoration: "underline" }}>
                    Personal Details:
                  </h6>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Full Name</label>
                      <input
                        {...register("fullName", { required: true })}
                        className="form-control"
                        type="text"
                        placeholder="Enter your Full Name"
                        readOnly
                      />
                      {errors.fullName && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    {/* <div className="col-md-6 mb-3">
                      <label>Last Name</label>
                      <input
                        {...register("lastName", { required: true })}
                        className="form-control"
                        type="text"
                        placeholder="Enter your Last Name"
                      />
                      {errors.lastName && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div> */}
                    <div className="col-md-6 mb-3">
                      <label>Age</label>
                      <input
                        {...register("age", { required: true })}
                        className="form-control"
                        type="number"
                        placeholder="Enter your Age"
                      />
                      {errors.age && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label>Email</label>
                      <input
                        {...register("email", { required: true })}
                        className="form-control"
                        type="email"
                        placeholder="Enter your Email"
                        readOnly
                      />
                      {errors.email && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Mobile_Number_1</label>
                      <input
                        {...register("mobileNo1", { required: true })}
                        className="form-control"
                        type="number"
                        placeholder="Enter your Mobile Number1"
                        readOnly
                      />
                      {errors.mobileNo1 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Mobile_Number_2</label>
                      <input
                        {...register("mobileNo2", { required: true })}
                        className="form-control"
                        type="number"
                        placeholder="Enter your Mobile Number2"
                      />
                      {errors.mobileNo2 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Address_1</label>
                      <textarea
                        {...register("address1", { required: true })}
                        className="form-control"
                        placeholder="Enter your Address 1"
                        readOnly
                      ></textarea>
                      {errors.address1 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Address_2</label>
                      <textarea
                        {...register("address2", { required: true })}
                        className="form-control"
                        placeholder="Enter your Address 2"
                      ></textarea>
                      {errors.address2 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label>City</label>
                      <input
                        {...register("city", { required: true })}
                        className="form-control"
                        type="text"
                        placeholder="Enter your City"
                      />
                      {errors.city && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>State</label>
                      <input
                        {...register("state", { required: true })}
                        className="form-control"
                        type="text"
                        placeholder="Enter your State"
                      />
                      {errors.state && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>Postal Code</label>
                      <input
                        {...register("postalCode", { required: true })}
                        className="form-control"
                        type="text"
                        placeholder="Enter Postal Code"
                      />
                      {errors.postalCode && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <h6 style={{ textDecoration: "underline" }} className="mt-5">
                    Other Details:
                  </h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Pet">Do You Live in a</label>
                      <br />
                      <select
                        {...register("liveIn", { required: true })}
                        name="liveIn"
                        id="liveIn"
                        className="form-control shadow"
                      >
                        <option value="">Please Select</option>
                        <option value="house">House</option>
                        <option value="townhouse">TownHouse</option>
                        <option value="apartment">Apartment</option>
                      </select>
                      {errors.liveIn && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Pet">Do You Have a Fenced Yard?</label>
                      <br />
                      <select
                        {...register("fenceYard", { required: true })}
                        name="fenceYard"
                        id="fenceYard"
                        className="form-control shadow"
                      >
                        <option value="">Please Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      {errors.fenceYard && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Pet">
                        Does Anyone in your Household have Allergies to Animals?
                      </label>
                      <br />
                      <select
                        {...register("allergies", { required: true })}
                        name="allergies"
                        id="allergies"
                        className="form-control shadow"
                      >
                        <option value="">Please Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      {errors.allergies && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Pet">
                        Are all Family Members Agreeable for Adopting a Pet?
                      </label>
                      <br />
                      <select
                        {...register("agreeable", { required: true })}
                        name="agreeable"
                        id="agreeable"
                        className="form-control shadow"
                      >
                        <option value="">Please Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      {errors.agreeable && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Pet">
                        Describe your House Activity Level?
                      </label>
                      <br />
                      <select
                        {...register("homeActivityLevel", { required: true })}
                        name="homeActivityLevel"
                        id="homeActivityLevel"
                        className="form-control shadow"
                      >
                        <option value="">Please Select</option>
                        <option value="busyNoisy">Busy/Noisy</option>
                        <option value="moderateComingAndGoing">
                          Moderate Comings/Goings
                        </option>
                        <option value="quiet">
                          Quiet with Occasional Guests
                        </option>
                      </select>
                      {errors.homeActivityLevel && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="Pet">
                        How many Hours in a Day would the pet be left Alone?
                      </label>
                      <br />
                      <select
                        {...register("spendTimeAlone", { required: true })}
                        name="spendTimeAlone"
                        id="spendTimeAlone"
                        className="form-control shadow"
                      >
                        <option value="">Please Select</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9orMore">9 or more</option>
                      </select>
                      {errors.spendTimeAlone && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <h6 style={{ textDecoration: "underline" }} className="mt-5">
                    Reference #1
                  </h6>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label>Full Name</label>
                      <input
                        {...register("refFullName1", { required: true })}
                        className="form-control"
                        type="text"
                        placeholder="Enter the reference Full Name"
                      />
                      {errors.refFullName1 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>Email</label>
                      <input
                        {...register("refEmail1", { required: true })}
                        className="form-control"
                        type="email"
                        placeholder="Enter the reference Email"
                      />
                      {errors.refEmail1 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>Mobile_Number</label>
                      <input
                        {...register("refMobileNumber1", { required: true })}
                        className="form-control"
                        type="number"
                        placeholder="Enter the reference Mobile Number"
                      />
                      {errors.refMobileNumber1 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label>Address</label>
                      <textarea
                        {...register("refAddress1", { required: true })}
                        className="form-control"
                        placeholder="Enter your reference Address"
                      ></textarea>
                      {errors.refAddress1 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>
                  <h6 style={{ textDecoration: "underline" }} className="mt-5">
                    Reference #2
                  </h6>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label>Full Name</label>
                      <input
                        {...register("refFullName2", { required: true })}
                        className="form-control"
                        type="text"
                        placeholder="Enter the reference Full Name"
                      />
                      {errors.refFullName2 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>Email</label>
                      <input
                        {...register("refEmail2", { required: true })}
                        className="form-control"
                        type="email"
                        placeholder="Enter the reference Email"
                      />
                      {errors.refEmail2 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>Mobile_Number</label>
                      <input
                        {...register("refMobileNumber2", { required: true })}
                        className="form-control"
                        type="number"
                        placeholder="Enter the reference Mobile Number"
                      />
                      {errors.refMobileNumber2 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label>Address</label>
                      <textarea
                        {...register("refAddress2", { required: true })}
                        className="form-control"
                        placeholder="Enter your reference Address"
                      ></textarea>
                      {errors.refAddress2 && (
                        <p className="text-danger">This field is required</p>
                      )}
                    </div>
                  </div>

                  <button className="btn btn-warning mt-2 w-100 py-3">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdoptionForm;
