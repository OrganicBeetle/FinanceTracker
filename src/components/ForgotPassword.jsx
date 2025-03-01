import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <form
            className="form"
          >
            <div className="title text-[10rem] font-bold mb-6 mt-[1rem] ml-[10px]">
              Reset your Password
            </div>
            <input
              className="input p-3 mb-4 w-full border-2 border-black rounded-lg shadow-sm"
              name="email"
              placeholder="Email"
              type="email"
            />
          </form>
    </div>
  );
};

export default ForgotPassword;
