import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { BiExpandAlt } from "react-icons/bi";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { Server_URL } from "../../utils/config";
import { utilityFunctions } from "../../utils/module";

function PendingRequests() {
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [petDetails, setPetDetails] = useState(null);
  const [request, setRequest] = useState([]);

  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setPetDetails(null); // Reset pet details when closing modal
  };

  const handleDetailsModalShow = async (userId) => {
    const userDetails = request.find((user) => user._id === userId);
    if (userDetails) {
      setSelectedUserDetails(userDetails);
      await getPetDetails(userDetails.petId); // Fetch pet details
      setShowDetailsModal(true);
    }
  };

  // Fetch pet details
  const getPetDetails = async (petId) => {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "pets/" + petId;
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (response.data.error) {
        toast.error(response.data.message);
      } else {
        const { pet } = response.data;
        setPetDetails(pet);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  async function getAdoptionData() {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "adoption-pets";
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const { error, message } = response.data;

      if (error && message === "Please SignIn First!!") {
        alert(message);
        navigate("/adminsignin");
      } else if (error) {
        alert(message);
      } else {
        const { result } = response.data;
        setRequest(result);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  async function CancelRequest(id) {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "adoption-pets/" + id;
      const res = await axios.put(
        url,
        { adoptionStatus: "Cancelled" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      const { error, message } = res.data;
      if (error) {
        // alert(message);
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
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
        getAdoptionData();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Confirm Adoption Request
  async function ConfirmRequest(id) {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "adoption-pets/" + id;
      const res = await axios.put(
        url,
        { adoptionStatus: "Confirmed" }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { error, message } = res.data;
      if (error) {
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
        getAdoptionData();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  //delete request
  async function DeleteRequest(id){
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "adoption-pets/" + id;
      const res = await axios.delete(url,{
        headers: {
          Authorization:`Bearer ${token}`
      }
      });
        console.log(res.data)
      const { error, message } = res.data;
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
      getAdoptionData();
      }
    }
    catch(e){
      console.log(e.message);
    }
  }

  useEffect(() => {
    getAdoptionData();
  }, []);

  return (
    <>
      <br />
      <h3 style={{ textAlign: "center" }} className="container">
        Requests For Adoption
      </h3>
      <div
        className="container"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>FullName</th>
              {/* <th>LastName</th> */}
              {/* <th>Age</th> */}
              <th>Email</th>
              <th>City</th>
              <th>Mobile1</th>
              <th>AdoptionStatus</th>
              <th>MoreDetails</th>
              <th colSpan={3} style={{ textAlign: "center" }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {request.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{value.fullName}</td>
                  {/* <td>{value.lastName}</td> */}
                  {/* <td>{value.age}</td> */}
                  <td>{value.email}</td>
                  <td>{value.city}</td>
                  <td>{value.mobileNo1}</td>
                  <td style={{ borderRight: "1px solid #8A897C" }}>
                    {value.adoptionStatus}
                  </td>

                  <td
                    style={{
                      borderRight: "1px solid #8A897C",
                      textAlign: "center",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleDetailsModalShow(value._id)} // Call the show function with user ID
                      className="btn btn-light btn-sm me-5"
                    >
                      <BiExpandAlt />
                    </button>
                  </td>
                  <td>
                    {value.adoptionStatus === "Confirmed" ? (
                      <span style={{ fontSize: "12px", color: "green" }}>
                        Confirmed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => ConfirmRequest(value._id)} // Call ConfirmRequest with the user's ID
                        className="btn btn-success btn-sm me-5"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                  <td>
                    {value.adoptionStatus === "Cancelled" ? (
                      <span style={{ fontSize: "12px", color: "red" }}>
                        Request Cancelled!
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => CancelRequest(value._id)}
                        className="btn btn-danger btn-sm me-5"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                  <td>
                    {
                      <button
                        type="button"
                        onClick={() => DeleteRequest(value._id)}
                        className="btn btn-danger btn-sm me-5"
                      >
                        Delete <FaTrashAlt />
                      </button>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* User Details Modal */}
        {selectedUserDetails && (
          <Modal
            show={showDetailsModal}
            onHide={handleDetailsModalClose}
            dialogClassName="modal-lg"
            scrollable
          >
            <Modal.Header closeButton>
              <Modal.Title>Adoption Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="row">
                <div className="col-md-12">
                  <h5
                    className="text-center"
                    style={{ textDecoration: "underline" }}
                  >
                    User's Personal Details
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Full Name:</strong>{" "}
                        {selectedUserDetails.fullName}
                      </p>

                      <p>
                        <strong>Age:</strong> {selectedUserDetails.age}
                      </p>

                      <p>
                        <strong>City:</strong> {selectedUserDetails.city}
                      </p>

                      <p>
                        <strong>Address 1:</strong>{" "}
                        {selectedUserDetails.address1}
                      </p>
                      <p>
                        <strong>Mobile No 1:</strong>{" "}
                        {selectedUserDetails.mobileNo1}
                      </p>
                    </div>
                    <div className="col-md-6">
                      {/* <p>
                        <strong>Last Name:</strong>{" "}
                        {selectedUserDetails.lastName}
                      </p> */}
                      <p>
                        <strong>Email:</strong> {selectedUserDetails.email}
                      </p>
                      <p>
                        <strong>State:</strong> {selectedUserDetails.state}
                      </p>
                      <p>
                        <strong>Address 2:</strong>{" "}
                        {selectedUserDetails.address2}
                      </p>
                      <p>
                        <strong>Mobile No 2:</strong>{" "}
                        {selectedUserDetails.mobileNo2}
                      </p>
                      <p>
                        <strong>Postal Code:</strong>{" "}
                        {selectedUserDetails.postalCode}
                      </p>
                    </div>
                  </div>
                  <hr />

                  <h5
                    className="text-center"
                    style={{ textDecoration: "underline" }}
                  >
                    Other Details
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Live In:</strong> {selectedUserDetails.liveIn}
                      </p>
                      <p>
                        <strong>Fence Yard:</strong>{" "}
                        {selectedUserDetails.fenceYard}
                      </p>
                      <p>
                        <strong>Allergies:</strong>{" "}
                        {selectedUserDetails.allergies}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Agreed:</strong> {selectedUserDetails.agreeable}
                      </p>
                      <p>
                        <strong>Home Activity Level:</strong>{" "}
                        {selectedUserDetails.homeActivityLevel}
                      </p>
                      <p>
                        <strong>Spend Time Alone:</strong>{" "}
                        {selectedUserDetails.spendTimeAlone} hrs
                      </p>
                    </div>
                  </div>
                  <hr />

                  <h5
                    className="text-center"
                    style={{ textDecoration: "underline" }}
                  >
                    References
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Reference #1</h6>
                      <p>
                        <strong>Full Name:</strong>{" "}
                        {selectedUserDetails.refFullName1}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUserDetails.refEmail1}
                      </p>
                      <p>
                        <strong>Mobile Number:</strong>{" "}
                        {selectedUserDetails.refMobileNumber1}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedUserDetails.refAddress1}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6>Reference #2</h6>
                      <p>
                        <strong>Full Name:</strong>{" "}
                        {selectedUserDetails.refFullName2}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUserDetails.refEmail2}
                      </p>
                      <p>
                        <strong>Mobile Number:</strong>{" "}
                        {selectedUserDetails.refMobileNumber2}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedUserDetails.refAddress2}
                      </p>
                    </div>
                  </div>
                  <hr />
                  {/* Displaying Pet Details */}
                  {petDetails && (
                    <>
                      <h5
                        className="text-center"
                        style={{ textDecoration: "underline" }}
                      >
                        Pet Details
                      </h5>
                      <div className="row">
                        {/* Pet Photo on the left side */}
                        <div className="col-md-4 text-center">
                          <img
                            src={`${Server_URL}${petDetails.petPhoto}`} // photo URL
                            alt="PetPhoto"
                            style={{
                              width: "100%",
                              height: "auto",
                              maxWidth: "250px",
                              border: "1px solid black",
                              borderRadius: ".5rem",
                            }}
                          />
                        </div>

                        {/* Pet Details on the right side */}
                        <div className="col-md-8">
                          <p>
                            <strong>Pet ID:</strong> {petDetails._id}
                          </p>
                          <p>
                            <strong>Name:</strong> {petDetails.petName}
                          </p>

                          <p>
                            <strong>Age:</strong> {petDetails.petAge}
                          </p>
                          <p>
                            <strong>Gender:</strong> {petDetails.petGender}
                          </p>
                          <p>
                            <strong>Weight:</strong> {petDetails.petWeight}
                          </p>
                          <p>
                            <strong>Description:</strong> {petDetails.aboutPet}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  );
}

export default PendingRequests;
