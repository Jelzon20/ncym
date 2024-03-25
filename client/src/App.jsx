import React from 'react'
import {BrowserRouter , Routes, Route} from 'react-router-dom'
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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/projects' element={<Projects />}/>
        <Route path='/primer' element={<Primer />}/>
        <Route path='/program' element={<Program />}/>
        <Route path='/workshops' element={<Workshops />}/>
        <Route path='/evaluation' element={<Evaluations />}/>
        <Route path='/host' element={<Host />}/>
        <Route path='/contact-us' element={<ContactUs />}/>
      </Routes>
   
   
   
    </BrowserRouter>
  )
}
