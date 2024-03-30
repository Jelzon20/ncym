import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Primer from './pages/Primer'
import Header from './components/Header'
import Program from './pages/Program'
import Workshops from './pages/Workshops'
import Evaluations from './pages/Evaluations'
import Host from './pages/Host'
import ContactUs from './pages/ContactUs'
import FooterCom from './components/Footer'
import PrivateRoute from './components/PrivateRoutes'
import { useSelector, useDispatch } from 'react-redux';

export default function App() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);


  return (
    <BrowserRouter>
      {currentUser && (
         <Header />
      )
      }
     
      <Routes>
        
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/primer' element={<Primer />} />
          <Route path='/program' element={<Program />} />
          <Route path='/workshops' element={<Workshops />} />
          <Route path='/evaluation' element={<Evaluations />} />
          <Route path='/host' element={<Host />} />
          <Route path='/contact-us' element={<ContactUs />} />
        </Route>
        
      </Routes>
      {currentUser && (
         <FooterCom />
      )
      }


    </BrowserRouter>
  )
}
