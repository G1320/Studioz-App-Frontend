// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const PayMePayment = ({ amount, vendorId, description }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [sale, setSale] = useState(null);

//   useEffect(() => {
//     const initializePayment = async () => {
//       try {
//         // Generate sale through your backend
//         const { data } = await axios.post('/api/payme/generate-sale', {
//           amount,
//           vendorId,
//           description
//         });

//         setSale(data);
//         setLoading(false);

//         // Initialize PayMe widget
//         window.PayMe.create({
//           sale_id: data.sale_id,
//           element_id: 'payme-widget',
//           sandbox: process.env.NODE_ENV !== 'production', // Use sandbox for development
//           language: 'he', // Hebrew interface
//           theme: {
//             // Customize theme to match your site
//             main_color: '#007bff',
//             text_color: '#333333'
//           }
//         });
//       } catch (err) {
//         setError('Failed to initialize payment');
//         setLoading(false);
//       }
//     };

//     // Load PayMe SDK
//     const script = document.createElement('script');
//     script.src = 'https://cdn.payme.io/js/sdk.js';
//     script.async = true;
//     script.onload = initializePayment;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, [amount, vendorId, description]);

//   return (
//     <div className="payment-container">
//       {error && <div className="error-message">{error}</div>}
//       {loading ? <div>Loading payment form...</div> : <div id="payme-widget"></div>}
//     </div>
//   );
// };

// export default PayMePayment;
