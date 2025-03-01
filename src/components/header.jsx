import React, { useEffect } from 'react';
import './header.css';
import { auth } from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';

const Header = () => {
  const [user , loading ] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      navigate('/dashboard');
    }
  }, [user , loading])
  
  function logoutFunction() {
    try {
      signOut(auth).then(() => {
        navigate('/');
        toast.success("Logged Out Successfully!");
      }).catch((error) => {
        toast.error(error.message);
      });
    } catch (error) {
      toast.error(error.message);
    }
    
  }

  return (
    <div className='flex items-center justify-between w-1'>
      <div className='navbar font-medium text-[2rem] font-[woff2]'>Tracky</div>
      {user && (
        <button className='logout font-[woff2] text-3xl' onClick={logoutFunction}>Logout</button>
      )}
      
    </div>
  );
};

export default Header;
