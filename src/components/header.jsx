import React, { useEffect } from 'react';
import './header.css';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]); // Added navigate to dependencies

  function logoutFunction() {
    signOut(auth)
      .then(() => {
        toast.success("Logged Out Successfully!");
        localStorage.clear();
        navigate('/');  // Ensure redirection happens after logout
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='navbar font-medium text-[2rem]'>Tracky</div>
      {user && (
        <button className='logout text-3xl' onClick={logoutFunction}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
