import Image from 'next/image';
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row items-center justify-between pt-5 px-5 md:px-10 lg:px-20 lg:mx-40 '>
      <div className='mb-5 md:mb-0 md:w-1/3'>
        <Image 
          src="/images/noozzule_logo-no_bg.png" 
          alt="My Image" 
          width={100} 
          height={100} 
        />
      </div>
      <div className='w-full md:w-1/3'></div>
      <div className='w-full md:w-1/3 flex justify-end'>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
