import React from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import webLogo from '../assets/webLogo.png'
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { volunteerSignoutSuccess } from '../redux/volunteer/volunteerSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { clearRegSuccess } from '../redux/register/registerSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { currentVolunteer } = useSelector((state) => state.volunteer);
  const { theme } = useSelector((state) => state.theme);

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
        localStorage.removeItem('expiresIn');
        dispatch(clearRegSuccess())
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleVolunteerSignout = async () => {
    try {
      const res = await fetch('/api/volunteer/volunteerSignOut', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(volunteerSignoutSuccess());
        localStorage.removeItem('expiresIn');
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (

    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <img src={webLogo} alt="NCYM Logo" className='w-32' />
      </Link>
      <div className='flex gap-2 md:order-2'>
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >

          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>

              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            {currentUser.isRegistered && (<Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>)}
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <></>
        )}

        {currentVolunteer ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentVolunteer.profilePicture} rounded />
            }
          >
            <Dropdown.Header>

              <span className='block text-sm font-medium truncate'>
                {currentVolunteer.username}
              </span>
            </Dropdown.Header>
           
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleVolunteerSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <></>
        )}
        <Navbar.Toggle />
      </div>

      {currentUser && currentUser.isRegistered && (<Navbar.Collapse>
        <Navbar.Link className='font-semibold' active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/program'} as={'div'}>
          <Link to='/program'>Program</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/workshops'} as={'div'}>
          <Link to='/workshops'>Workshops</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/evaluation'} as={'div'}>
          <Link to='/evaluation'>Evaluation</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/host'} as={'div'}>
          <Link to='/host'>The Host</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/messages'} as={'div'}>
          <Link to='/messages'>Messages</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/accomodation'} as={'div'}>
          <Link to='/accomodation'>Accommodations & Venues</Link>
        </Navbar.Link>  
      </Navbar.Collapse>)}

      {currentVolunteer && (<Navbar.Collapse>
        <Navbar.Link className='font-semibold' active={path === '/'} as={'div'}>
          <Link to='/volunteerHome'>Home</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/program'} as={'div'}>
          <Link to='/program'>Attendance Monitoring</Link>
        </Navbar.Link>
        
      </Navbar.Collapse>)}

    </Navbar>
  )
}