import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const ForgotPassword = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
          autoFocus
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
