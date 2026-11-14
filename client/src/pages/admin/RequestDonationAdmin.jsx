import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Server_URL } from "../../utils/config";
import { utilityFunctions } from "../../utils/module";

const RequestDonationAdmin = () => {
  const [data, setData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();
  const openModal = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  async function getHomelessPetsData() {
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "getHomelessPets-data";
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const { error, message } = response.data;
      if (error && message === "Please SignIn First!!") {
        toast.error(message);
        navigate("/adminsignin");
      } else if (error) {
        toast.error(message);
      } else {
        const { result } = response.data;
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }

  async function deleteData(id){
    try {
      const token = utilityFunctions.getCookieValue("adminAuthToken");
      const url = Server_URL + "getHomelessPets-data/" + id;
      const res = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
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
        getHomelessPetsData();
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  

  useEffect(() => {
    getHomelessPetsData();
  }, []);

  return (
    <div className="container mt-5">
      {/* Page Title */}
      <h1 className="text-center mb-4 text-dark fw-bold">
        Homeless Pet Reports
      </h1>

      {/* Table for Displaying Reports */}
      <div className="table-responsive shadow-lg rounded">
        <table className="table table-bordered table-hover text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Informer's Name</th>
              <th>Contact Number</th>
              <th>Pet Description</th>
              <th>Activity/Action</th>
              <th>Location Found</th>
              <th>Reported On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((report, index) => (
                <tr key={report._id}>
                  <td>{index + 1}</td>
                  <td>{report.reporterName}</td>
                  <td>{report.contactNumber}</td>
                  <td>
                    <strong>Type:</strong> {report.petType} <br />
                    <strong>Color:</strong> {report.petColor} <br />
                    <strong>Size:</strong> {report.petSize}
                  </td>
                  <td>
                    <strong>Activity:</strong> {report.petActivity} <br />
                    <strong>Action:</strong> {report.immediateAction}
                  </td>
                  <td>{report.locationFound || "N/A"}</td>
                  <td>
                    {report.dateFound && report.timeFound
                      ? new Date(
                          `${report.dateFound}T${report.timeFound}:00`
                        ).toLocaleString()
                      : "Date/Time not provided"}
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm mx-1"
                      onClick={() => openModal(report)}
                    >
                      More Details
                    </button>
                    <button className="btn btn-danger btn-sm mx-1"
                    onClick={() => deleteData(report._id)}>
                      Remove Report
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-muted">
                  No reports available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for More Details */}
      {selectedReport && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg ">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Homeless Pet Report Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                
                <h5 className="text-primary mb-3">Pet Details</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Pet Type:</strong> {selectedReport.petType}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Pet Gender:</strong> {selectedReport.petGender}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Pet Size:</strong> {selectedReport.petSize}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Pet Color:</strong> {selectedReport.petColor}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Pet Behavior:</strong> {selectedReport.petBehavior}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Pet Condition:</strong>{" "}
                    {selectedReport.petCondition}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Pet Activity:</strong> {selectedReport.petActivity}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Immediate Action:</strong>{" "}
                    {selectedReport.immediateAction}
                  </div>
                </div>

                
                <h5 className="text-primary mt-4 mb-3">Informer Details</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Informer's Name:</strong>{" "}
                    {selectedReport.reporterName}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Contact Number:</strong>{" "}
                    {selectedReport.contactNumber}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Email:</strong> {selectedReport.email}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Home Address:</strong> {selectedReport.homeAddress}
                  </div>
                </div>

                
                <h5 className="text-primary mt-4 mb-3">
                  Location & Additional Details
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Location Found:</strong>{" "}
                    {selectedReport.locationFound}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Weather Condition:</strong>{" "}
                    {selectedReport.weatherCondition}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Date Found:</strong> {selectedReport.dateFound}
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Time Found:</strong> {selectedReport.timeFound}
                  </div>
                  <div className="col-md-12 mb-3">
                    <strong>Additional Notes:</strong>{" "}
                    {selectedReport.additionalNotes || "None"}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDonationAdmin;
