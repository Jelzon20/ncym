import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import {
  signoutSuccess
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { clearRegSuccess } from '../redux/register/registerSlice';
import Cookies from "js-cookie";

export default function PrivateRoute() {
    const dispatch = useDispatch()


  const accessToken = Cookies.get("access_token");

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        dispatch(clearRegSuccess())
        if(currentUser == null) {
          window.location.href = "/sign-in";
        } 
        
      }
    } catch (error) {
      console.log(error.message);
    }
  };
    // Get a cookie
  useEffect(() => {
    if(!accessToken){
      handleSignout()
    }
    
  },[])
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;

 
}