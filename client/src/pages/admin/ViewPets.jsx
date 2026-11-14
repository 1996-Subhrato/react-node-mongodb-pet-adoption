import {useForm} from "react-hook-form";
import axios from "axios";
import {useState, useEffect, useContext} from "react";
import {FaTrashAlt} from "react-icons/fa";
import {MdAddPhotoAlternate} from "react-icons/md";
import {toast} from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {BiExpandAlt} from "react-icons/bi";
import {GrMultiple} from "react-icons/gr";
// import Modal from "react-bootstrap/Modal";
// import EditForm from "./users/EditForm";
// import { userContext } from "../App";
import {useNavigate} from "react-router-dom";
import {Server_URL} from "../../utils/config";
import {utilityFunctions} from "../../utils/module";

function ViewPets() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(null);
    const [showpetGalleryModal, setShowPetGalleryModal] = useState(null);

    const [selectedPetId, setSelectedPetId] = useState(null); // State to store the selected pet ID
    const [selectedPetDetails, setSelectedPetDetails] = useState(null);

    const [pet, setPet] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = (petId) => {
        setSelectedPetId(petId); // Set the selected pet ID when "AddPhoto" is clicked
        setShow(true);
    };

    const handleDetailsModalClose = () => setShowDetailsModal(false);
    const handleDetailsModalShow = (petDetails) => {
        setSelectedPetDetails(petDetails);
        setShowDetailsModal(true);
    };

    const handleGalleryModalClose = () => setShowPetGalleryModal(false);
    const handleGalleryModalShow = (petId) => {
        setSelectedPetId(petId); // Set the selected pet ID when "AddPhoto" is clicked
        setShowPetGalleryModal(true);
    };

    async function getPetData() {
        try {
            // console.log(data)
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-pets";
            const response = await axios.get(url, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });
            console.log(response.data);
            const {error, message} = response.data;
            console.log(error, message);

            if (error && message === "Please SignIn First!!") {
                alert(message);

                navigate("/adminsignin");
            } else if (error) {
                alert(message);
            } else {
                const {result} = response.data;
                setPet(result);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    // const navigate = useNavigate();

    async function deletePet(id) {
        try {
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-pets/" + id;
            const res = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res.data);
            const {error, message} = res.data;
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
                getPetData();
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        // setFocus('FullName')
        getPetData();
    }, []);

    const {register, handleSubmit, reset} = useForm();

    async function onSubmit(data) {
        try {
            console.log(data.photo[0]);
            const formData = new FormData(); //used when we upload file in form
            formData.append("photo", data.photo[0]);
            formData.append("petId", selectedPetId); // Add the selected pet ID
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-pet-photo";
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const {error, message} = response.data;
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
                getPetData();
                // console.log("Updated Pets Data:", pet);
                reset();
                setShow(false); // Close modal after upload
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    async function PetGallerySubmit(data) {
        try {
            console.log(data.photoGallery[0]);
            const formData = new FormData(); //used when we upload file in form
            formData.append("photoGallery", data.photoGallery[0]);
            formData.append("petId", selectedPetId); // Add the selected pet ID
            const token = utilityFunctions.getCookieValue("adminAuthToken");
            const url = Server_URL + "manage-pet-photoGallery";
            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const {error, message} = response.data;
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
                getPetData();

                reset();
                setShow(false); // Close modal after upload
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <>
            <br/>
            <h3 style={{textAlign: "center"}} className="container">
                Added Pets For Adoption
            </h3>
            <div
                className="container"
                style={{overflowX: "auto", whiteSpace: "nowrap"}}
            >
                <table className="table table-striped table-dark table-sm">
                    {/* style={{ backgroundColor: "#FDCA40" }} */}
                    <thead>
                    <tr>
                        <th>PetType</th>
                        <th>Breed</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Color</th>
                        <th>Availability</th>
                        <th>MoreDetails</th>
                        <th colSpan={2} style={{textAlign: "center"}}>
                            Action
                        </th>
                        <th>Add GalleryPhotos</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pet.map((value, index) => {
                        return (
                            <tr key={index}>
                                <td>{value.petTypeCategory}</td>
                                <td>{value.petBreedSubCategory}</td>
                                <td>{value.petName}</td>
                                <td>{value.petAge}</td>
                                <td>{value.petGender}</td>
                                <td>{value.petcolor}</td>
                                <td style={{borderRight: "1px solid #8A897C"}}>
                                    {value.isAvailable}
                                </td>
                                <td
                                    style={{
                                        borderRight: "1px solid #8A897C",
                                        textAlign: "center",
                                    }}
                                >
                                    {
                                        <button
                                            type="button"
                                            onClick={() => handleDetailsModalShow(value)}
                                            className="btn btn-light btn-sm me-5"
                                        >
                                            <BiExpandAlt/>
                                        </button>
                                    }
                                </td>
                                <td>
                                    {
                                        <button
                                            type="button"
                                            onClick={() => deletePet(value._id)}
                                            className="btn btn-danger btn-sm me-5"
                                        >
                                            <FaTrashAlt/>
                                        </button>
                                    }
                                </td>

                                <td style={{borderRight: "1px solid #8A897C"}}>
                                    {!value.petPhoto || value.petPhoto === " " ? (
                                        <button
                                            type="button"
                                            onClick={() => handleShow(value._id)}
                                            className="btn btn-dark btn-sm me-5"
                                        >
                                            <MdAddPhotoAlternate/>
                                        </button>
                                    ) : (
                                        <span style={{fontSize: "12px", color: "#C4A381"}}>Photo Uploaded!</span>
                                    )}
                                </td>

                                <td style={{textAlign: "center"}}>
                                    {
                                        <button
                                            type="button"
                                            onClick={() => handleGalleryModalShow(value._id)}
                                            className="btn btn-light btn-sm me-5"
                                        >
                                            <GrMultiple/>
                                        </button>
                                    }
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>

                {/* //Add photo Modal */}
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Pet Photo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label>Select Photo</label>
                                <input
                                    type="file"
                                    {...register("photo")}
                                    className="form-control"
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-start">
                        <Button variant="primary" onClick={handleSubmit(onSubmit)}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* // More Details Modal */}
                {selectedPetDetails && (
                    <Modal
                        show={showDetailsModal}
                        onHide={handleDetailsModalClose}
                        dialogClassName="modal-lg"
                        // scrollable
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Pet Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                {selectedPetDetails.petPhoto && (
                                    <div className="col-md-4 mt-5">
                                        <img
                                            src={`${Server_URL}${selectedPetDetails.petPhoto}`} //photo url
                                            alt="PetPhoto"
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                border: "5px solid black",
                                                // borderRadius:".7rem"
                                            }}
                                        />
                                        <center>
                                            <h5>{selectedPetDetails.petName}</h5>
                                        </center>
                                    </div>
                                )}
                                <div
                                    className="col-md-8"
                                    style={{
                                        maxHeight: "400px", // Define max height for the scrollable section
                                        overflowY: "auto", // Enable vertical scroll
                                        paddingLeft: "20px", // Some spacing from the fixed image
                                    }}
                                >
                                    <p>
                                        <strong>Pet Type:</strong>{" "}
                                        {selectedPetDetails.petTypeCategory}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Breed:</strong>{" "}
                                        {selectedPetDetails.petBreedSubCategory}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Name:</strong> {selectedPetDetails.petName}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Age:</strong> {selectedPetDetails.petAge}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Gender:</strong> {selectedPetDetails.petGender}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Color:</strong> {selectedPetDetails.petcolor}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Weight:</strong> {selectedPetDetails.petWeight}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Vaccinated:</strong> {selectedPetDetails.vaccinated}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Friendly To Other Pets:</strong>{" "}
                                        {selectedPetDetails.friendlyToOtherPets}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Children Friendly:</strong>{" "}
                                        {selectedPetDetails.childrenFriendly}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>Available:</strong> {selectedPetDetails.isAvailable}
                                    </p>
                                    <hr/>
                                    <p>
                                        <strong>About Pet:</strong> {selectedPetDetails.aboutPet}
                                    </p>
                                    <hr/>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                )}


                {/* //Gallery Modal */}
                <Modal
                    show={showpetGalleryModal}
                    onHide={handleGalleryModalClose}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Pet Photo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={handleSubmit(PetGallerySubmit)}>
                            <div className="mb-3">
                                <label>Select Photo</label>
                                <input
                                    type="file"
                                    {...register("photoGallery")}
                                    className="form-control"
                                />
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-start">
                        <Button variant="primary" onClick={handleSubmit(PetGallerySubmit)}>
                            Upload
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default ViewPets;
