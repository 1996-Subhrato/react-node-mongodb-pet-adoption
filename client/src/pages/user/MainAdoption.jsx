import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { utilityFunctions } from "../../utils/module";

const MainAdoption = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [adoption, setAdoption] = useState([]);
  const [petsGallery, setPetsGallery] = useState([]);

  async function getAdoptionData() {
    try {
      const token = utilityFunctions.getCookieValue("userAuthToken");
      const response = await axios.get(`${Server_URL}adopt-pets/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const { error, message, result } = response.data;
      if (error) {
        toast.error(message);
        if (message === "Please SignIn First!!") navigate("/usersignin");
      } else {
        setAdoption(result);
      }
    } catch (error) {
      toast.error("Failed to fetch pet data.");
    }
  }

  async function getPetsGallery() {
    try {
      const token = utilityFunctions.getCookieValue("userAuthToken");
      const response = await axios.get(`${Server_URL}GetPetsGallery/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const { error, message, result } = response.data;
      if (error) {
        toast.error(message);
        if (message === "Please SignIn First!!") navigate("/usersignin");
      } else {
        setPetsGallery(result);
      }
    } catch (error) {
      toast.error("Failed to fetch gallery images.");
    }
  }

  useEffect(() => {
    getAdoptionData();
    getPetsGallery();
  }, [id]);

  return (
    <>
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          <div className="section-heading" data-aos="zoom-in">
            <h1>Adopt a Pet</h1>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/user/userdashboard">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/user/adoption-page">Adoption</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Adopt a Pet
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="page">
        <div className="container">
          <div className="row">
            {adoption.map((value, index) => (
              <div className="col-lg-12" key={index}>
                <div className="row bg-light-custom border-irregular1 block-padding">
                  {/* Image Section */}
                  <div className="col-lg-4 offset-lg-2">
                    <div className="col-md-12">
                      <img
                        src={`${Server_URL}${value.petPhoto}`}
                        className="border-irregular1 img-fluid hover-opacity"
                        alt={`${value.petName}`}
                      />
                    </div>
                  </div>

                  {/* Adoption Info */}
                  <div className="col-lg-4 res-margin mt-5 text-xs-center">
                    <h4>
                      <strong>Pet name:</strong> {value.petName}
                    </h4>
                    <div className="row">
                      <div className="col-sm-6">
                        <ul className="list-unstyled pet-adopt-info">
                          <li className="h7">Type: <span>{value.petTypeCategory}</span></li>
                          <li className="h7">Gender: <span>{value.petGender}</span></li>
                          <li className="h7">Age: <span>{value.petAge}</span></li>
                          <li className="h7">Breed: <span>{value.petBreedSubCategory}</span></li>
                          <li className="h7">Available: <strong style={{ color: value.isAvailable === "Adopted" ? "red" : "green" }}>{value.isAvailable}</strong></li>
                        </ul>
                      </div>
                      <div className="col-sm-6">
                        <ul className="list-unstyled pet-adopt-info">
                          <li className="h7">Weight: <span>{value.petWeight}</span></li>
                          <li className="h7">Vaccinated: <span>{value.vaccinated}</span></li>
                          <li className="h7">Color: <span>{value.petcolor}</span></li>
                          <li className="h7">Children Friendly: <span>{value.childrenFriendly}</span></li>
                        </ul>
                      </div>
                    </div>
                    <p className="font-weight-bold">{value.about}</p>

                    {value.isAvailable === "Adopted" ? (
                      <div className="alert alert-warning" role="alert"
                        style={{
                          textAlign: "center",
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                        }}>
                        This Pet is Adopted
                      </div>
                    ) : (
                      <Link
                        className="btn btn-primary"
                        to={`/user/adoptionform/${value._id}`}
                        data-aos="zoom-in"
                      >
                        Adopt now!
                      </Link>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="col-md-12 mt-5">
                  <h3>About {value.petName}</h3>
                  <ul className="custom list-inline font-weight-bold">
                    <li className="list-inline-item">Friendly with other pets</li>
                    <li className="list-inline-item">Perfect for apartments</li>
                    <li className="list-inline-item">Great with children</li>
                  </ul>
                  <p>{value.aboutPet}</p>

                  <div className="alert alert-primary mt-5" role="alert">
                    <h6 className="text-light">Adoption Rules</h6>
                    <p>
                      Our adoption process is designed to ensure each pet finds the right forever home.
                      Please complete our application, schedule a meet-and-greet, and be prepared to provide references.
                      We aim to make sure our animals go to loving and suitable homes where they’ll thrive.
                    </p>
                  </div>
                  <p className="custom-link">
                    <Link to="/user/adoption-page">« Go back to adoption gallery</Link>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pet Gallery */}
        <h3 className="text-center" style={{ textDecoration: 'underline' }}>Pet Gallery</h3>
        <div
          id="gallery-isotope"
          className="mt-5 d-flex flex-wrap justify-content-center"
        >
          {petsGallery.map((image, index) => (
            <div className="col-lg-3 col-sm-6 col-md-6 p-2" key={index}>
              <div className="gallery-thumb">
                <img
                  className="img-fluid"
                  src={`${Server_URL}${image.petPhotoGallery}`}
                  alt=""
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                <a href={`${Server_URL}${image.petPhotoGallery}`} title="PetPhoto">
                  <span className="overlay-mask"></span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainAdoption;
