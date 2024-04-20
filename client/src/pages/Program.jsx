import React from 'react'
import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getRegistrationStart,
  getRegistrationSuccess,
  getRegistrationFailure,
} from "../redux/register/registerSlice";

import p7 from '../assets/p7.png';
import p8 from '../assets/p8.png';
import p9 from '../assets/p9.png';
import p10 from '../assets/p10.png';
import p11 from '../assets/p11.png';

export default function Program() {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {

    if (currentUser.isAccepted && currentUser.isRegistered) {
      navigate("/program");
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
    <section className="bg-gradient-to-r from-red-800 via-orange-600 to-yellow-400 dark:bg-gray-900 min-h-screen max-w-full">
      {/* bg-hero bg-gradient-to-r from-orange-500 to-yellow-500 */}
      {/* <div className="flex flex-col items-center justify-center py-8 px-4 text-center mx-auto max-w-screen-xl lg:py-16 lg:px-12"> */}
      <div className="flex flex-col items-center justify-center text-center mx-auto lg:py-8 max-w-screen-xl">
        <div className="bg-slate-500">
          {/* <img src={ComingSoon} alt="astronaut image" className="" /> */}
         
          <img src={p7} alt="p1" className="shadow-2xl" />
          <img src={p8} alt="p2" className="shadow-2xl" />
          <img src={p9} alt="p1" className="shadow-2xl" />
          <img src={p10} alt="p2" className="shadow-2xl" />
          <img src={p11} alt="p2" className="shadow-2xl" />
        </div>
      </div>
    </section>
  )
}
