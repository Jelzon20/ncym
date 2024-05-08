import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Messages from './pages/Messages'
import Header from './components/Header'
import Program from './pages/Program'
import Workshops from './pages/Workshops'
import Evaluations from './pages/Evaluations'
import Host from './pages/Host'
import FooterCom from './components/Footer'
import PrivateRoute from './components/PrivateRoutes'
import { useSelector} from 'react-redux';
import Registration from './pages/Registration'
import Accomodation from './pages/Accomodation'
import WorkshopSub from './pages/WorkshopSub'
import { useEffect, useState } from 'react'
import {
  signoutSuccess
} from './redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { clearRegSuccess } from './redux/register/registerSlice';

export default function App() {
  

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch()

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
        } else{
          console.log('currentUser is still present')
        }
        
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const checkForInactivity = () => {
    const expireTime = localStorage.getItem('expiresIn');
   if (expireTime < Date.now()) {
    handleSignout();
   }
  }

  const updateExpireTime = () => {
    const expireTime = Date.now() + 3600000;
    localStorage.setItem('expiresIn', expireTime);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      checkForInactivity();
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    updateExpireTime();

    window.addEventListener('click', updateExpireTime);
    window.addEventListener('keypress', updateExpireTime);
    window.addEventListener('scroll', updateExpireTime);
    window.addEventListener('mousemove', updateExpireTime);

    return () => {
      window.addEventListener('click', updateExpireTime);
      window.addEventListener('keypress', updateExpireTime);
      window.addEventListener('scroll', updateExpireTime);
      window.addEventListener('mousemove', updateExpireTime);
    }
  }, []);

  // checkForInactivity();
  return (
    <BrowserRouter>
      {currentUser && (
         <Header />
      )
      }

      <Routes>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />

        <Route element={<PrivateRoute />}>
          
          <Route path='/' element={<Home />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/messages' element={<Messages />} />
          <Route path='/program' element={<Program />} />
          <Route path='/workshops' element={<WorkshopSub />} />
          <Route path='/evaluation' element={<Evaluations />} />
          <Route path='/host' element={<Host />} />
          <Route path='/accomodation' element={<Accomodation />} />
          {/* <Route path='/workshopSub' element={<WorkshopSub />} /> */}
        </Route>
        
      </Routes>
      {currentUser && (
         <FooterCom />
      )
      }


    </BrowserRouter>
  )
}
