import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import logo from "../assets/logov6.png";
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { Toaster, toast } from 'sonner'

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !formData.email || !formData.password) {
      toast.error("Please fill out all fields.")
      // return setErrorMessage('Please fill out all fields.');
    } 
    
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
        toast.error(data.message);
        setLoading(false);
      }
      setLoading(false);
      if(res.ok) {
        toast.success("Account has been created")
        navigate('/sign-in');
      }
    } 
    catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
      setLoading(false);
    }
    
  };

  return (
    <div className='min-h-screen mt-20'>
      <Toaster richColors position="top-center" expand={true} />

      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        {/* {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )} */}
        <div className='flex-1'>
          {/* <Link to='/' className='font-bold dark:text-white text-4xl'>
          <span className='px-2 py-1 bg-indigo-950 rounded-lg text-white'>
              NCYM
            </span>
            <span className='text-indigo-950'>
            2024
            </span>
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p> */}
           <img src={logo} alt="astronaut image" className="" />
        </div>
        {/* right */}

        <div className='flex-1'>
        <h1 className='text-gray-800 font-bold text-3xl mb-1"'>Create new account</h1>
          <p className=''></p>
          <div className='flex gap-2 text-sm font-normal text-gray-600 mb-7 mt-1'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>
              Sign In
            </Link>
          </div>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Email' htmlFor="email" className='font-semibold' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
                
                required
              />
            </div>
            <div>
              <Label value='Password' className='font-semibold' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
                required
              />
            </div>
            <Button
              className='bg-indigo-950'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <OAuth />
          </form>
          
          
        </div>
      </div>
    </div>
  );
}