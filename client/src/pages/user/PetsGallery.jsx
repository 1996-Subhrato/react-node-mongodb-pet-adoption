import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Server_URL } from "../../utils/config";
import { utilityFunctions } from "../../utils/module";
const PetsGallery = () => {
  const [allPetsGallery, setAllPetsGallery] = useState([]);
  async function fetchGalleryData() {
    try {
      const token = utilityFunctions.getCookieValue("userAuthToken");
      const url = Server_URL + "AllPetGalleryData";
      const response = await axios.get(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const { error, result } = response.data;
      if (!error) {
        setAllPetsGallery(result);
      }
    } catch (error) {
      console.log("Error fetching pet gallery:", error.message);
    }
  }

  useEffect(() => {
    fetchGalleryData();
  }, []);
  return (
    <>

    {/* Jumbotron */}
    <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          <div className="section-heading" data-aos="zoom-in">
            <h1>Pets Gallery</h1>
          </div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/user/userdashboard">Home</Link>
              </li>
              {/* <li className="breadcrumb-item">
                <Link to="/user/adoption-page">Adoption</Link>
              </li> */}
              <li className="breadcrumb-item active" aria-current="page">
                Pets Gallery
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* All Pets Gallery Section */}
      <section id="all-pets-gallery" className="cat-bg1">
        <div className="container  text-center">
          {/* <h3>Pets Gallery</h3> */}
          <div
            id="gallery-isotope"
            style={{
              display: "flex",
              flexWrap: "wrap",
              margin: "0 -15px",
              marginLeft: "3rem",
              marginRight: "3rem",
            }}
          >
            {allPetsGallery.map((image,index) => (
                <div
                  className="dogscats col-lg-3 col-sm-6 col-md-6"
                  style={{ padding: "0 15px" }}
                  key={index}
                >
                  <div className="isotope-item">
                    <div className="gallery-thumb">
                      <img
                        className="img-fluid"
                        src={`${Server_URL}${image.petPhotoGallery}`}
                        alt="Pet Gallery Image"
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                      <a
                        href={`${Server_URL}${image.petPhotoGallery}`}
                        title="PetPhoto"
                      >
                        <span className="overlay-mask"></span>
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
};
export default PetsGallery;
