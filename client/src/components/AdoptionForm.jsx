// import React, { useState } from 'react';

// const AdoptionForm = ({ pet, onClose }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission, e.g., sending the data to an API
//     console.log("Adoption Form Data: ", formData);
//     onClose(); // Close the modal after submission
//   };

//   // Inline CSS styles
//   const styles = {
//     overlay: {
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       background: 'rgba(0, 0, 0, 0.7)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     content: {
//       background: 'white',
//       padding: '20px',
//       borderRadius: '8px',
//       width: '400px',
//     },
//     label: {
//       display: 'block',
//       marginBottom: '5px',
//     },
//     input: {
//       width: '100%',
//       padding: '8px',
//       border: '1px solid #ccc',
//       borderRadius: '4px',
//       marginBottom: '15px',
//     },
//     textarea: {
//       width: '100%',
//       padding: '8px',
//       border: '1px solid #ccc',
//       borderRadius: '4px',
//       marginBottom: '15px',
//     },
//     button: {
//       marginTop: '10px',
//       padding: '10px 15px',
//       background: '#007BFF',
//       color: 'white',
//       border: 'none',
//       borderRadius: '4px',
//       cursor: 'pointer',
//     },
//   };

//   return (
//     <div style={styles.overlay}>
//       <div style={styles.content}>
//         <h2>Adopt {pet.petName}</h2>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label htmlFor="name" style={styles.label}>Full Name:</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               style={styles.input}
//             />
//           </div>
//           <div>
//             <label htmlFor="email" style={styles.label}>Email:</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               style={styles.input}
//             />
//           </div>
//           <div>
//             <label htmlFor="phone" style={styles.label}>Phone Number:</label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               style={styles.input}
//             />
//           </div>
//           <div>
//             <label htmlFor="address" style={styles.label}>Address:</label>
//             <textarea
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               required
//               style={styles.textarea}
//             />
//           </div>
//           <button type="submit" style={styles.button}>Submit Adoption Request</button>
//         </form>
//         <button onClick={onClose} style={styles.button}>Close</button>
//       </div>
//     </div>
//   );
// };

// export default AdoptionForm;
