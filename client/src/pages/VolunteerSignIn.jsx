import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import logo from "../assets/logov6.png";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'sonner'

import {
  volunteerSignInStart,
  volunteerSignInSuccess,
  volunteerSignInFailure,
} from '../redux/volunteer/volunteerSlice';

import moment from 'moment'


export default function VolunteerSignIn() {
  const [formData, setFormData] = useState({});
  // const { loading, error: errorMessage, currentVolunteer } = useSelector((state) => state.volunteer);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !formData.password) {
      
      dispatch(volunteerSignInFailure('Please fill all the fields'));
      toast.error('Please fill all the fields')
    }
    try {
      setLoading(true);
      dispatch(volunteerSignInStart());
      const res = await fetch('/api/volunteer/volunteerSignIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(volunteerSignInFailure(data.message));
        
        toast.error(data.message)
      }

      if (res.ok) {
        // localStorage.setItem('expiresIn', expireTime);
        dispatch(volunteerSignInSuccess(data));
        toast.success("Sign in successful")
        navigate('/volunteerHome');
        setLoading(false);
      }
    } catch (error) {
      dispatch(volunteerSignInFailure(error.message));
      toast.error(error.message)
    }
  };
  

  return (
    <div className='min-h-screen mt-20'>
      <Toaster richColors position="top-center" expand={true} />
     
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
        <img src={logo} alt="astronaut image" className="" />
         
        </div>
        
        {/* right */}
        <div className='flex-1'>
          <h1 className='text-gray-800 font-bold text-3xl mb-5"'>Maupay nga adlaw,</h1>
          <h1 className='text-gray-800 font-bold text-3xl mb-5"'>ka-lakbay!</h1>
          <p className='mb-7 mt-1'>Volunteer Sign In</p>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Code' className='font-semibold'/>
              <TextInput
                type='text'
                id='password'
                onChange={handleChange}
                required
              />
            </div>
            
            <Button
              className='bg-indigo-950'
              type='submit'
            >
           {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
                
            </Button>
            {/* <OAuth />  */}
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Go back to</span>
            <Link to='/sign-in' className='text-indigo-950'>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}