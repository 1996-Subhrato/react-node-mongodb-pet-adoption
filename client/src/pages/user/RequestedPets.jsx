import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import axios from "axios";
import {BiExpandAlt} from "react-icons/bi";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {Link} from "react-router-dom";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

const RequestedPets = () => {
    const navigate = useNavigate();
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);

    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [request, setRequest] = useState([]);

    // Close the details modal
    const handleDetailsModalClose = () => {
        setShowDetailsModal(false);
    };

    // Open details modal for the selected user
    const handleDetailsModalShow = (userDetails) => {
        setSelectedUserDetails(userDetails);
        setShowDetailsModal(true);
    };

    // Open the feedback modal
    const handleFeedbackModalShow = (userId, petId) => {
        setSelectedUserId(userId);
        // console.log(userId)
        setSelectedPetId(petId);
        setShowFeedbackModal(true);
    };

    // Close the feedback modal
    const handleFeedbackModalClose = () => {
        setShowFeedbackModal(false);
        setFeedback(""); // for resetting the feedback field modal mein
    };

    // Fetch adoption requests and pet details
    async function getAdoptionData() {
        try {
            const token = utilityFunctions.getCookieValue("userAuthToken");
            const url = Server_URL + "adoption-pets-request";
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            const {error, message, result} = response.data;

            if (error && message === "Please SignIn First!!") {
                alert(message);
                navigate("/adminsignin");
            } else if (error) {
                alert(message);
            } else {
                // Fetching pet details for each adoption request
                const requestsWithPets = await Promise.all(
                    result.map(async (user) => {
                        const petResponse = await axios.get(
                            `${Server_URL}pets/${user.petId}`,
                            {
                                headers: {
                                    Authorization: token ? `Bearer ${token}` : "",
                                },
                            }
                        );
                        return {
                            ...user,
                            petDetails: petResponse.data.pet,
                        };
                    })
                );
                setRequest(requestsWithPets);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    //for submitting the feedback
    const submitFeedback = async () => {
        if (!feedback.trim()) {
            toast.error("Please provide feedback before submitting.");
            return;
        }
        try {
            const token = utilityFunctions.getCookieValue("userAuthToken");
            const feedbackData = {
                userId: selectedUserId,
                petId: selectedPetId,
                feedback,
            };
            const response = await axios.post(Server_URL + 'feedback', feedbackData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            const {error, message} = response.data;
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
                handleFeedbackModalClose(); // Close the feedback modal after submitting
            }
        } catch (error) {
            console.error("Error submitting feedback:", error.message);
            toast.error("Error submitting feedback.");
        }
    };


    // Run the fetch function on component mount
    useEffect(() => {
        getAdoptionData();
    }, []);

    return (
        <>
            {/* Jumbotron */}
            <div className="jumbotron jumbotron-fluid overlay">
                <div className="jumbo-heading">
                    <div className="section-heading" data-aos="zoom-in">
                        <h1>Your Requests For Adoption</h1>
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/user/userdashboard">Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Your Requests For Adoption
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
            <br/>

            <div className="container mt-3">
                <div className="row">
                    {request.map((user) => (
                        <div className="col-md-6 mb-4" key={user._id}>
                            <Card style={{backgroundColor: "#FFFAFA"}} className="shadow">
                                <h6>Adoption Details</h6>
                                <hr/>
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    {/* Adoption Status - Centered at the top */}
                                    <div className="text-center mb-3">
                                        <strong>Status: </strong>
                                        <span
                                            style={{
                                                color: "white",
                                                backgroundColor: user.adoptionStatus === "Confirmed" ? "green" : user.adoptionStatus === "Cancelled" ? "red" : "orange",
                                                padding: "5px 10px",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            {user.adoptionStatus === "Confirmed" ? "Request Confirmed" : user.adoptionStatus === "Cancelled" ? "Request Cancelled!" : "Pending"}
                                        </span>
                                    </div>

                                    <hr/>

                                    {/* User and Pet Details - Displayed in two columns */}
                                    <div className="row">
                                        <div className="col-md-4">
                                            <img
                                                src={`${Server_URL}${user.petDetails.petPhoto}`}
                                                alt="PetPhoto"
                                                style={{
                                                    width: "100%",
                                                    height: "auto",
                                                    maxWidth: "150px",
                                                    borderRadius: ".5rem",
                                                    marginTop: "10px",
                                                }}
                                            />
                                        </div>

                                        <div className="col-md-8">
                                            {user.petDetails && (
                                                <>
                                                    <h5 className="mb-0">Pet Name: {user.petDetails.petName}</h5>
                                                    <strong>Age: </strong> {user.petDetails.petAge} <br/>
                                                    <strong>Gender: </strong>{user.petDetails.petGender} <br/>
                                                    <strong>Pet Weight: </strong>{user.petDetails.petWeight}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Buttons in a row */}
                                    <div className="d-flex justify-content-center mt-3">
                                        {/* View More Button - Always visible */}
                                        <Button
                                            style={{backgroundColor: "grey", marginRight: "10px"}}
                                            variant="outline-warning"
                                            onClick={() => handleDetailsModalShow(user)}
                                        >
                                            <BiExpandAlt/> View More
                                        </Button>

                                        {/* Give Feedback Button - odo dikhega jdo status is confirmed */}
                                        {user.adoptionStatus === "Confirmed" && (
                                            <Button
                                                style={{backgroundColor: '#7DCE84'}}
                                                // #26413C
                                                variant="outline-primary"
                                                onClick={() =>
                                                    handleFeedbackModalShow(user.userId, user.petId)
                                                }
                                            >
                                                Give Feedback
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

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
                        {/* User Details Section */}
                        <div className="row">
                            <div className="col-md-6">
                                <h5 style={{textDecoration: "underline"}}>
                                    User's Personal Details
                                </h5>
                                <p>
                                    <strong>Full Name:</strong> {selectedUserDetails.fullName}
                                </p>
                                <p>
                                    <strong>Age:</strong> {selectedUserDetails.age}
                                </p>
                                <p>
                                    <strong>City:</strong> {selectedUserDetails.city}
                                </p>
                                <p>
                                    <strong>Address 1:</strong> {selectedUserDetails.address1}
                                </p>
                                <p>
                                    <strong>Mobile No 1:</strong> {selectedUserDetails.mobileNo1}
                                </p>
                                <p>
                                    <strong>Postal Code:</strong> {selectedUserDetails.postalCode}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <h5 style={{textDecoration: "underline"}}>Other Details</h5>
                                <p>
                                    <strong>Live In:</strong> {selectedUserDetails.liveIn}
                                </p>
                                <p>
                                    <strong>Fence Yard:</strong> {selectedUserDetails.fenceYard}
                                </p>
                                <p>
                                    <strong>Allergies:</strong> {selectedUserDetails.allergies}
                                </p>
                            </div>
                        </div>
                        <hr/>
                        {/* Pet Details Section */}
                        {selectedUserDetails.petDetails && (
                            <>
                                <h5 style={{textDecoration: "underline"}}>Pet Details</h5>
                                <div className="row">
                                    <div className="col-md-4">
                                        <img
                                            src={`${Server_URL}${selectedUserDetails.petDetails.petPhoto}`}
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
                                    <div className="col-md-8">
                                        <p>
                                            <strong>Pet ID:</strong>{" "}
                                            {selectedUserDetails.petDetails._id}
                                        </p>
                                        <p>
                                            <strong>Name:</strong>{" "}
                                            {selectedUserDetails.petDetails.petName}
                                        </p>
                                        <p>
                                            <strong>Age:</strong>{" "}
                                            {selectedUserDetails.petDetails.petAge}
                                        </p>
                                        <p>
                                            <strong>Gender:</strong>{" "}
                                            {selectedUserDetails.petDetails.petGender}
                                        </p>
                                        <p>
                                            <strong>Weight:</strong>{" "}
                                            {selectedUserDetails.petDetails.petWeight}
                                        </p>
                                        <p>
                                            <strong>Description:</strong>{" "}
                                            {selectedUserDetails.petDetails.aboutPet}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </Modal.Body>
                </Modal>
            )}

            {/* Feedback Modal */}
            <Modal
                show={showFeedbackModal}
                onHide={handleFeedbackModalClose}
                dialogClassName="modal-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Submit Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h5>Provide Feedback for Pet</h5>
                        <textarea
                            rows="4"
                            className="form-control"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Write your feedback here..."
                        />
                        <Button
                            variant="success"
                            className="mt-3"
                            onClick={submitFeedback}
                        >
                            Submit Feedback
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default RequestedPets;
