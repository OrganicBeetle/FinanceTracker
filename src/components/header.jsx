import React, { useEffect, useState } from "react";
import "./header.css";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userSvg from "../assets/user.svg";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]); 

  function logoutFunction() {
    signOut(auth)
      .then(() => {
        toast.success("Logged Out Successfully!");
        localStorage.clear();
        navigate("/"); // Ensure redirection after logout
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  return (
    <div className="flex items-center justify-between w-full py-4 px-6 bg-gray-800 text-white">
      <div className="navbar font-medium text-[2rem]">
        Tracky
      </div>
      {user && (
        <div
          className="logout flex items-center text-3xl"
          onClick={logoutFunction}
        >
          <img
            src={user.photoURL ? user.photoURL : userSvg}
            width={user.photoURL ? "32" : "24"}
            height="32"
            style={{
              marginRight: 10,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="User Profile"
          />
          Logout
        </div>
      )}
    </div>
  );
};

export default Header;
