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
  const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch()


  const accessToken = Cookies.get("access_token");

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/sign out', {
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
    // setTimeout(() => {
    //   if(!accessToken){
    //     setTimeout(() => {
    //       handleSignout();
    //     }, 2000);
        
    //   }
    // }, 5000);
    // console.log(accessToken)
  });

  

  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;

 
}