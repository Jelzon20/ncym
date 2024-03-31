import React from 'react'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [registered, setRegistered] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    setRegistered(currentUser.isRegistered)
    if(!registered) {  
      navigate('/registration');
    }
  },[currentUser])
  

 return  (
    <section className="bg-white dark:bg-gray-900 min-h-screen">
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">NCYM 2024</h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">We are coming soon.</p>
    </div>
</section>
  ) 
}

