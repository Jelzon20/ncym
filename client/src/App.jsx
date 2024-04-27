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



export default function App() {

  const { currentUser } = useSelector((state) => state.user);

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
          <Route path='/workshops' element={<Workshops />} />
          <Route path='/evaluation' element={<Evaluations />} />
          <Route path='/host' element={<Host />} />
          <Route path='/accomodation' element={<Accomodation />} />
          <Route path='/workshopSub' element={<WorkshopSub />} />
        </Route>
        
      </Routes>
      {currentUser && (
         <FooterCom />
      )
      }


    </BrowserRouter>
  )
}
