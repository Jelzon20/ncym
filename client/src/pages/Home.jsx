import React from 'react'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getRegistrationStart,
  getRegistrationSuccess,
  getRegistrationFailure,
} from '../redux/register/registerSlice';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
   const navigate = useNavigate();
   const dispatch = useDispatch();

   useEffect(() => {
    console.log(currentUser.isRegistered)

    if(currentUser.isRegistered) {
        navigate('/');
    } else {
      navigate('/registration');
    }
  }, [currentUser]);


  useEffect(() => {
    async function getRegistration() {
       try {
         dispatch(getRegistrationStart());
         const getReg = await fetch(`/api/reg/${currentUser.id}`, {
           method: "GET",
           headers: { "Content-Type": "application/json" },
         });
         const data = await getReg.json();
         console.log(data);
         if (data.success === false) {
           dispatch(getRegistrationFailure(data.message));
         }
         dispatch(getRegistrationSuccess(data));
         
       } catch (error) {
         dispatch(getRegistrationFailure(error.message));
       }
    }
    getRegistration();
  }, [currentUser]);

  // try {
  //   dispatch(getRegistrationStart());
  //   const getReg = await fetch(`/api/reg/${currentUser.id}`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });
  //   const data = await getReg.json();
  //   if (data.success === false) {
  //     dispatch(getRegistrationFailure(data.message));
  //   }
  //   dispatch(getRegistrationSuccess(data));
  //   navigate("/");
  // } catch (error) {
  //   dispatch(getRegistrationFailure(error.message));
  // }

return  (
    <section className="bg-white dark:bg-gray-900 min-h-screen">
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">NCYM 2024</h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">We are coming soon.</p>
    </div>
</section>
  ) 

}

