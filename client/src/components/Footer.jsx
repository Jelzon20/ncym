import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
import webLogo from '../assets/webLogo.png'
export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='flex justify-between w-full items-center sm:flex flex-col md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
            >
            <img src={webLogo} alt="NCYM Logo" className='w-60'/>
            </Link>
          </div>
          <div className='flex flex-col text-center'>
           
            <p className='font-bold text-sm md:text-lg'>Follow us on facebook to learn more!</p>
            <p><a href='https://www.facebook.com/archpaloyouth?mibextid=YMEMSu' className='text-blue-600 text-sm md:text-lg'>Archdiocese of Palo Commission on Youth </a></p>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full flex items-center justify-between'>
          <Footer.Copyright
            href='#'
            by="NCYM 2024"
            year={new Date().getFullYear()}
          />
          <div className="">
            <Footer.Icon href='https://www.facebook.com/archpaloyouth?mibextid=YMEMSu' icon={BsFacebook}/>
            
          </div>
        </div>
      </div>
    </Footer>
  );
}