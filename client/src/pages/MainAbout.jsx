import React from 'react';
import { Link } from 'react-router-dom';

const MainAbout = () => {
  return (
    <>
      {/* Jumbotron */}
      <div className="jumbotron jumbotron-fluid overlay">
        <div className="jumbo-heading">
          {/* Section Heading */}
          <div className="section-heading" data-aos="zoom-in">
            <h1>About Us</h1>
          </div>
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                About us
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="page">
        <div className="container block-padding pt-0">
          <div className="row">
            <div className="col-lg-5 mb-5 mb-lg-0">
              <img
                src="/assets/img/about1.jpg"
                alt="About Us"
                className="img-fluid border-irregular2"
                data-aos="zoom-in"
              />
            </div>
            <div className="col-lg-7 res-margin my-auto">
              <h3>Your Pet Deserves the Best</h3>
              <p>
                At our adoption center, we believe every pet deserves a happy, healthy life. Our mission is to connect you with pets who match your lifestyle and provide resources to support lifelong relationships. Our knowledgeable team is here to answer your questions, ensuring both pets and pet parents receive the best care.
              </p>
              <p>
                <strong>We're dedicated to supporting your pet with quality, love, and responsibility.</strong> Whether you're adopting a new companion or finding resources for an existing pet, we're committed to being a reliable partner in your journey.
              </p>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-lg-7">
              <h4>Enhancing Pet Life Quality</h4>
              <p>
                Through our dedication to holistic pet wellness, we strive to enhance the quality of life for all pets. Our services include providing access to expert guidance, top-quality nutrition, and fun activities to keep your pets both happy and healthy.
              </p>
              <ul className="custom ps-0">
                <li>Expert advice and support tailored to each pet's needs</li>
                <li>A curated selection of safe, quality products</li>
                <li>Guidance on pet training, wellness, and nutrition</li>
              </ul>
            </div>
            <div className="col-lg-5 res-margin">
              <div id="accordion" className="accordion-cards">
                {/* Accordion Card 1 */}
                <div className="card">
                  <div
                    className="card-header collapsed"
                    id="headingOne"
                    role="tablist"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="false"
                    aria-controls="collapseOne"
                  >
                    <h6 className="mb-0 accordion-header">Our Philosophy</h6>
                  </div>
                  <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordion">
                    <div className="card-body">
                      <p>
                        We believe in creating meaningful connections between people and pets, fostering love, trust, and joy in every adoption. Our team is here to support you from the adoption process through the entire life of your pet.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Accordion Card 2 */}
                <div className="card">
                  <div
                    className="card-header"
                    id="headingTwo"
                    role="tablist"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    <h6 className="mb-0 accordion-header">Why Choose Us?</h6>
                  </div>
                  <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordion">
                    <div className="card-body">
                      <p>
                        Our dedication to compassionate care and knowledgeable service sets us apart. From providing personalized adoption consultations to offering ongoing support, we’re committed to ensuring every pet is given the opportunity for a happy, fulfilling life.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Accordion Card 3 */}
                <div className="card">
                  <div
                    className="card-header"
                    id="headingThree"
                    role="tablist"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    <h6 className="mb-0 accordion-header">Top Quality Products</h6>
                  </div>
                  <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-bs-parent="#accordion">
                    <div className="card-body">
                      <p>
                        We offer a carefully selected range of pet products, including nutritious food, engaging toys, and comfortable accessories. Every item in our store is chosen to support the health and happiness of your pet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div id="call-to-action" className="container block-padding">
            <div className="col-lg-6 offset-lg-6 bg-primary text-light card text-center">
              <h4>Subscribe to Our Newsletter</h4>
              <p>Stay updated with the latest tips, news, and offers for your pets. Join our community for exclusive content delivered straight to your inbox!</p>
              <div id="mc_embed_signup">
                <form action="YOUR_FORM_ACTION" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank" noValidate>
                  <div id="mc_embed_signup_scroll">
                    <div className="mc-field-group">
                      <div className="input-group">
                        <input className="form-control input-lg required email" type="email" name="EMAIL" placeholder="Your email here" id="mce-EMAIL" />
                        <button className="btn btn-primary" type="submit">Subscribe</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Block */}
          <div className="container bottom-block-padding">
            <div className="bg-light-custom card">
              <div className="row">
                <div className="col-xl-6">
                  <h4>Caring for Your Pets Since 2001</h4>
                  <p>With over two decades of experience, we take pride in providing unmatched care, understanding, and love for your pets. Our dedicated team ensures every pet's journey is filled with safety, comfort, and happiness.</p>
                  <ul className="custom ps-0">
                    <li>Experienced and passionate team</li>
                    <li>Top-quality pet products</li>
                    <li>Customized care plans for every pet</li>
                  </ul>
                </div>
                <div className="col-xl-6 my-auto">
                  {/* Embed Video */}
                  <div className="ratio ratio-16x9">
                    <iframe src="https://www.youtube.com/embed/lWQaaZkqND4" allowFullScreen title="About Us Video"></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainAbout;
