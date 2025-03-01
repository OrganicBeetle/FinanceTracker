import React, { useState } from "react";

const ForgotPassword = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPasswordClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate password reset process (you can integrate Firebase or your logic here)
    setTimeout(() => {
      setLoading(false);
      alert("Password reset link sent!");
      setIsFormVisible(false);
    }, 2000); // Simulate 2-second delay
  };

  return (
    <div>
      {/* Forgot Password Button */}
      <div className="mt-4 text-center flex justify-center items-center">
        <p
          className="forgotPassword text-[woff1] cursor-pointer"
          onClick={handleForgotPasswordClick}
        >
          Forgot your password?
        </p>
      </div>

      {/* Forgot Password Form */}
      {isFormVisible && (
        <div className="modal-overlay fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="forgot-password-form bg-white p-6 rounded-lg shadow-lg relative">
            <div className="close">
              <h2 className="text-lg font-bold mb-4">Reset Password</h2>
              <button
                onClick={handleCloseForm}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              >
                ✖
              </button>
            </div>

            {/* Reset Password Form */}
            <div onSubmit={handlePasswordReset} className="w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border-2 border-black rounded-md mb-12"
                required
              />
              <div className="ResetPassword flex justify-center items-center">
                <button
                  type="submit"
                  disabled={loading}
                  className={`border-none w-full h-10 rounded-lg border-2 border-black 
                    bg-lightblue shadow-lg font-semibold text-black cursor-pointer 
                    disabled:cursor-not-allowed disabled:opacity-50 mt-4`}
                >
                  {loading ? "Loading..." : "Reset"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
