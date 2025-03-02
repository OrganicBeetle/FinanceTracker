import React, { useEffect } from "react";
import "./header.css";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userSvg from "../assets/user.svg";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]); // Added navigate to dependencies

  function logoutFunction() {
    signOut(auth)
      .then(() => {
        toast.success("Logged Out Successfully!");
        localStorage.clear();
        navigate("/"); // Ensure redirection happens after logout
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  return (
    <div className="flex items-center justify-between w-full py-4 px-6 bg-gray-800 text-white">
      <div className="navbar font-medium text-[2rem]">Tracky</div>
      {user && (
        <p
          className="logout flex items-center text-3xl"
          onClick={logoutFunction}
        >
          <img
            src={user.photoURL ? user.photoURL : userSvg}
            width={user.photoURL ? "32" : "24"}
            style={{ borderRadius: "50%", marginRight: 10}}
            alt="User Profile"
            className="mr-2" // margin-right to separate the image from the text
          />
          Logout
        </p>
      )}
    </div>
  );
};

export default Header;
