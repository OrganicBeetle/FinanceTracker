import React, { useState, useEffect } from "react";
import "./Signup.css";
import "../components/ForgotPassword.css";
import Header from "../components/header";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db, provider } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth";
import ForgotPassword from "../components/ForgotPassword";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();
  const [resetEmail, setResetEmail] = useState("");

  const handleForgotPasswordClick = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setResetEmail(""); // Clear the email when closing the form
  };

  const getFriendlyErrorMessage = (errorCode) => {
    const errorMessages = {
      "auth/email-already-in-use":
        "This email is already in use. Try logging in.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters long.",
      "auth/user-not-found": "No account found. Please sign up first.",
      "auth/wrong-password":
        "Incorrect password. Try again or reset your password.",
      "auth/network-request-failed":
        "Network error. Check your internet connection.",
      "auth/popup-closed-by-user": "Sign-in Pop-up was closed. Try again.",
      "auth/cancelled-popup-request":
        "Multiple popups were blocked. Please try again.",
      default: "Something went wrong. Please try again.",
    };

    return errorMessages[errorCode] || errorMessages["default"];
  };

  const signupWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !password) {
      toast.error("All fields are mandatory");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("USER -> ", user);
      await createUserDocument(user, name);
      toast.success("Account Created Successfully");
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || name,
        })
      );
      setName("");
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      const errorCode = error.code;
      toast.error(getFriendlyErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("All fields are mandatory!");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      toast.success("Successfully Logged In!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || name,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      const errorCode = error.code;
      toast.error(getFriendlyErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };

  const signupWithGoogle = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDocument(user, user.displayName);
      toast.success("Successfully Authenticated!");
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.displayName,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      const errorCode = error.code;
      toast.error(getFriendlyErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };

  const createUserDocument = async (user, name) => {
    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);
      const userData = await getDoc(userRef);

      if (!userData.exists()) {
        await setDoc(userRef, {
          name: user.displayName || name,
          email: user.email,
          photoUrl: user.photoURL || "",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      toast.error(`Error creating user document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!resetEmail) {
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent!");
      handleCloseForm(); // Close the form after sending the email
    } catch (error) {
      const errorCode = error.code;
      toast.error(getFriendlyErrorMessage(errorCode));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex justify-center items-center p-6">
        {!loginForm ? (
          <form className="form" onSubmit={signupWithEmail}>
            <div className="title text-[5rem] font-bold mb-6 mt-[1rem] ml-[10px]">
              Welcome,
              <br />
              <span className="text-gray-600 font-medium text-lg">
                Sign up to continue
              </span>
            </div>
            <input
              className="input p-3 mb-4 w-full border-2 border-black rounded-lg shadow-sm"
              name="Full Name"
              placeholder="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="input p-3 mb-4 w-full border-2 border-black rounded-lg shadow-sm"
              name="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input p-3 mb-4 w-full border-2 border-black rounded-lg shadow-sm"
              name="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-[0.5rem] login-with flex gap-4 self-center">
              <div
                className="button-log p-3 w-12 h-12 flex justify-center items-center rounded-full border-2 border-black bg-lightblue shadow-lg cursor-pointer"
                onClick={signupWithGoogle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 56.6934 56.6934"
                  className="icon w-6 h-6 fill-black"
                >
                  <path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z"></path>
                </svg>
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              className={`button-confirm w-full h-10 rounded-lg border-2 border-black 
    bg-lightblue shadow-lg font-semibold text-black cursor-pointer 
    disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {loading ? "Let's go →" : "Let's go →"}
            </button>
            <div className="redirect">
              <span>
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setLoginForm(!loginForm);
                  }}
                >
                  Log in
                </span>
              </span>
            </div>
          </form>
        ) : (
          <form className="form" onSubmit={loginWithEmail}>
            <div className="title text-[5rem] font-bold mb-6 mt-[1rem] ml-[10px]">
              Welcome Back,
              <br />
              <span className="text-gray-600 font-medium text-lg">
                Log In to continue
              </span>
            </div>
            <input
              className="input p-3 mb-4 w-full border-2 border-black rounded-lg shadow-sm"
              name="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input p-3 mb-4 w-full border-2 border-black rounded-lg shadow-sm"
              name="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="mt-[0.5rem] login-with flex gap-4 self-center">
              <div
                className="button-log p-3 w-12 h-12 flex justify-center items-center rounded-full border-2 border-black bg-lightblue shadow-lg cursor-pointer"
                onClick={signupWithGoogle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 56.6934 56.6934"
                  className="icon w-6 h-6 fill-black"
                >
                  <path d="M51.981,24.4812c-7.7173-0.0038-15.4346-0.0019-23.1518-0.001c0.001,3.2009-0.0038,6.4018,0.0019,9.6017  c4.4693-0.001,8.9386-0.0019,13.407,0c-0.5179,3.0673-2.3408,5.8723-4.9258,7.5991c-1.625,1.0926-3.492,1.8018-5.4168,2.139  c-1.9372,0.3306-3.9389,0.3729-5.8713-0.0183c-1.9651-0.3921-3.8409-1.2108-5.4773-2.3649  c-2.6166-1.8383-4.6135-4.5279-5.6388-7.5549c-1.0484-3.0788-1.0561-6.5046,0.0048-9.5805  c0.7361-2.1679,1.9613-4.1705,3.5708-5.8002c1.9853-2.0324,4.5664-3.4853,7.3473-4.0811c2.3812-0.5083,4.8921-0.4113,7.2234,0.294  c1.9815,0.6016,3.8082,1.6874,5.3044,3.1163c1.5125-1.5039,3.0173-3.0164,4.527-4.5231c0.7918-0.811,1.624-1.5865,2.3908-2.4196  c-2.2928-2.1218-4.9805-3.8274-7.9172-4.9056C32.0723,4.0363,26.1097,3.995,20.7871,5.8372  C14.7889,7.8907,9.6815,12.3763,6.8497,18.0459c-0.9859,1.9536-1.7057,4.0388-2.1381,6.1836  C3.6238,29.5732,4.382,35.2707,6.8468,40.1378c1.6019,3.1768,3.8985,6.001,6.6843,8.215c2.6282,2.0958,5.6916,3.6439,8.9396,4.5078  c4.0984,1.0993,8.461,1.0743,12.5864,0.1355c3.7284-0.8581,7.256-2.6397,10.0725-5.24c2.977-2.7358,5.1006-6.3403,6.2249-10.2138  C52.5807,33.3171,52.7498,28.8064,51.981,24.4812z"></path>
                </svg>
              </div>
            </div>
            <button
              disabled={loading}
              type="submit"
              className={`button-confirm w-full h-10 rounded-lg border-2 border-black 
    bg-lightblue shadow-lg font-semibold text-black cursor-pointer 
    disabled:cursor-not-allowed disabled:opacity-50 mt-4`}
            >
              {loading ? "Loading..." : "Let's go →"}
            </button>
            <div className="redirect">
              <span className="font-semibold text-[1rem] text-[woff2] mt-[2px] flex justify-center">
                Don't have an account?{" "}
                <span
                  className=" font-bold text-[woff2] cursor-pointer"
                  onClick={() => {
                    setLoginForm(!loginForm);
                  }}
                >
                  Sign Up
                </span>
              </span>
            </div>
            <ForgotPassword />
          </form>
        )}
      </div>
    </>
  );
};

export default Signup;
