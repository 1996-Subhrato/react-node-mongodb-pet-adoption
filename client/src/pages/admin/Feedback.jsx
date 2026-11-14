import axios from "axios";
import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { Server_URL } from "../../utils/config";
import { utilityFunctions } from "../../utils/module";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch feedback data on component mount
  useEffect(() => {
    async function fetchFeedbackData() {
      try {
        const token = utilityFunctions.getCookieValue("adminAuthToken");
        const response = await axios.get(`${Server_URL}fetch-feedbacks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.error) {
          console.error("Error fetching feedback:", response.data.message);
          return;
        }

        setFeedbacks(response.data.feedbacks);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    }

    fetchFeedbackData();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-5">User's Feedbacks</h3><hr />
      <div className="row">
        {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
          feedbacks.map((feedback) => (
            <div className="col-md-4 mb-4" key={feedback._id}>
              <Card
                className="shadow-sm h-100"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Card.Body className="d-flex flex-column">
                  {/* Display User Details */}
                  <Card.Title className="text-primary">
                    {feedback.userDetails.fullName}
                  </Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    {feedback.userDetails.address}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Email:</strong> {feedback.userDetails.email} <br />
                    <strong>Mobile:</strong> {feedback.userDetails.mobile}
                  </Card.Text>

                  {/* Display Pet Details */}
                  <hr />
                  <div className="text-center mb-3">
                    <img
                      src={`${Server_URL}${feedback.petDetails.petPhoto}`}
                      alt="PetPhoto"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "150px",
                        borderRadius: ".5rem",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                  <Card.Text className="text-center">
                    <strong>Pet Name:</strong> {feedback.petDetails.petName} <br />
                    <strong>Age:</strong> {feedback.petDetails.petAge} <br />
                    <strong>Gender:</strong> {feedback.petDetails.petGender} <br />
                    <strong>Color:</strong> {feedback.petDetails.petcolor}
                  </Card.Text>

                  {/* Display Feedback Text */}
                  <hr />
                  <div className="mt-auto">
                    <p>
                      <strong>Feedback about <span className="text-primary">{feedback.petDetails.petName}</span>:</strong> {feedback.feedback}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-center">No feedback available</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
