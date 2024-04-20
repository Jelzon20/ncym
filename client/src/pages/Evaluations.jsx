import React from 'react'
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getRegistrationStart,
  getRegistrationSuccess,
  getRegistrationFailure,
} from "../redux/register/registerSlice";
import ComingSoon from "../assets/maintenance.svg";

export default function Evaluations() {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {

    if (currentUser.isAccepted && currentUser.isRegistered) {
      navigate("/evaluation");
    } else if (currentUser.isRegistered) {
      navigate("/dashboard?tab=profile");
    } else {
      navigate("/registration");
    }
  }, [currentUser]);

  useEffect(() => {
    async function getRegistration() {
      try {
        dispatch(getRegistrationStart());
        const getReg = await fetch("/api/reg/me/", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await getReg.json();
        if (data.success === false) {
          return dispatch(getRegistrationFailure(data.message));
        }
        dispatch(getRegistrationSuccess(data));
      } catch (error) {
        return dispatch(getRegistrationFailure(error.message));
      }
    }
    getRegistration();
  }, [currentUser]);

  return (
    <section className="bg-gradient-to-r  from-red-800 via-orange-600 to-yellow-400 dark:bg-gray-900 min-h-screen max-w-full">
     
    <div className="flex flex-col items-center justify-center text-center mx-auto lg:py-8 max-w-screen-xl">
      <div>
      <img src={ComingSoon} alt="astronaut image" className="" />
       <h1 className='text-white font-bold text-3xl font-futura'>COMING SOON</h1>
       <h1 className='text-white font-medium'>Follow <a href='https://www.facebook.com/archpaloyouth?mibextid=YMEMSu' className='text-indigo-950 font-medium'> Archdiocese of Palo Commission on Youth </a> on Facebook to learn more!</h1>

      </div>
    </div>
  </section>
  )
}
