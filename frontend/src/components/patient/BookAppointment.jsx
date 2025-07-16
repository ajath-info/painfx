import React, { useState } from "react";
   import { useLocation } from "react-router-dom";
   import { format } from 'date-fns';
   import Header from "../common/Header";
   import Footer from "../common/Footer";
   import DoctorImage from "../../images/dentist.png";

   const BookingForm = () => {
     const location = useLocation();
     console.log('Location state:', location.state); // Debug log
     const { doctor, selectedSlot } = location.state || {};

     const [formData, setFormData] = useState({
       firstName: "",
       lastName: "",
       email: "",
       phone: "",
       nameOnCard: "",
       cardNumber: "",
       expiryMonth: "",
       expiryYear: "",
       cvv: "",
       paymentMethod: "card",
       acceptedTerms: false,
     });

     const handleChange = (e) => {
       const { name, value, type, checked } = e.target;
       setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
       }));
     };

     const handleSubmit = (e) => {
       e.preventDefault();
       if (!formData.acceptedTerms) {
         alert("Please accept Terms & Conditions");
         return;
       }

       const bookingDetails = {
         ...formData,
         doctor: {
           name: doctor?.name || "Dr. Darren Elder",
           role: doctor?.role || "Dentist",
           date: selectedSlot?.day || "16 Nov 2019",
           time: selectedSlot?.time || "10:00 AM",
           total: (doctor?.consultationFee || 100)// Default fees: consulting + booking + video
         },
       };

       console.log("Booking Info:", bookingDetails);
     };

     const FloatingInput = ({ name, label, type = "text", value }) => (
       <div className="relative w-full">
         <input
           type={type}
           name={name}
           value={value}
           onChange={handleChange}
           placeholder=" "
           className="peer w-full border border-gray-300 rounded-md px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#09DCA4]"
         />
         <label className="absolute left-4 top-2 text-gray-500 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
           {label}
         </label>
       </div>
     );

     const formattedDate = selectedSlot?.day ? format(new Date(selectedSlot.day), 'dd MMM yyyy') : '16 Nov 2019';

     return (
       <>
         <Header />
         <div className="max-w-6xl mx-auto px-4 py-8">
           <div className="grid md:grid-cols-3 gap-6">
             {/* Form Section */}
             <form
               onSubmit={handleSubmit}
               className="md:col-span-2 space-y-6 bg-white p-6 shadow border border-gray-200 rounded"
             >
               <h2 className="text-2xl font-bold">Personal Information</h2>
               <div className="grid md:grid-cols-2 gap-4">
                 <FloatingInput
                   name="firstName"
                   label="First Name"
                   value={formData.firstName}
                 />
                 <FloatingInput
                   name="lastName"
                   label="Last Name"
                   value={formData.lastName}
                 />
                 <FloatingInput
                   name="email"
                   label="Email"
                   type="email"
                   value={formData.email}
                 />
                 <FloatingInput
                   name="phone"
                   label="Phone"
                   type="tel"
                   value={formData.phone}
                 />
               </div>

               <label className="flex items-center space-x-2 text-sm">
                 <input
                   type="checkbox"
                   name="acceptedTerms"
                   checked={formData.acceptedTerms}
                   onChange={handleChange}
                 />
                 <span className="text-lg">
                   I have read and accept{" "}
                   <a href="#" className="text-blue-600 underline">
                     Terms & Conditions
                   </a>
                 </span>
               </label>

               <button
                 type="submit"
                 className="px-6 text-xl py-3 text-white rounded font-semibold transition duration-300"
                 style={{ backgroundColor: "#0078FD" }}
               >
                 Confirm Booking
               </button>
             </form>

             {/* Booking Summary Section */}
             <div className="bg-white shadow rounded p-8 border border-gray-200 h-fit">
               <h2 className="text-2xl font-bold mb-4">Booking Summary</h2>
               <div className="flex items-center space-x-4">
                 <img
                   src={doctor?.image || DoctorImage}
                   alt="Doctor"
                   className="rounded w-28 h-30 object-cover"
                 />
                 <div>
                   <h3 className="font-bold text-xl">{doctor?.name || "Dr. Darren Elder"}</h3>
                   <div className="text-yellow-500 text-lg">
                     {"★".repeat(Math.floor(doctor?.rating || 4))}
                     {"☆".repeat(5 - Math.floor(doctor?.rating || 4))}
                     <span className="text-sm text-gray-600 ml-2">
                       {(doctor?.reviews || 35)}
                     </span>
                   </div>
                   <p className="text-gray-500 text-sm">📍 {doctor?.location || "Newyork, USA"}</p>
                 </div>
               </div>

               <div className="mt-6 space-y-2 text-sm text-gray-700">
                 <p className="flex justify-between">
                   <span className="font-bold text-lg">Date</span>
                   <span className="text-lg">{formattedDate}</span>
                 </p>
                 <p className="flex justify-between">
                   <span className="font-bold text-lg">Time</span>
                   <span className="text-lg">{selectedSlot?.time || "10:00 AM"}</span>
                 </p>
                 <p className="flex justify-between">
                   <span className="font-bold text-lg">Consulting Fee</span>
                   <span className="text-lg">${doctor?.consultationFee || 100}</span>
                 </p>
                 <p className="flex justify-between">
                   {/* <span className="font-bold text-lg">Booking Fee</span> */}
                   {/* <span className="text-lg">$10</span> */}
                 </p>
                 <p className="flex justify-between">
                   {/* <span className="font-bold text-lg">Video Call</span> */}
                   {/* <span className="text-lg">$50</span> */}
                 </p>
                 <hr />
                 <p className="flex justify-between font-bold text-[#0078FD]">
                   <span className="font-bold text-lg">Total</span>
                   <span className="text-lg">
                     $
                     {(doctor?.consultationFee || 100)}
                   </span>
                 </p>
               </div>
             </div>
           </div>
         </div>
         <Footer />
       </>
     );
   };

   export default BookingForm;