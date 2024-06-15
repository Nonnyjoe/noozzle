import React from 'react'
import ReviewForm from './ReviewForm'

const Reviews = () => {
  return (
    <div className='border mt-12 mx-4 md:mx-10 lg:mx-20 p-6 md:p-12 lg:p-20 bg-white rounded-3xl'>
      <h1 className='text-center text-2xl md:text-3xl lg:text-4xl font-bold uppercase text-cyan-600 mb-8'>Reviews about Noozzule</h1>
      <div className='border mt-6 md:mt-10 min-h-fit h-80 md:h-80  max-h-fit rounded-3xl'>
        {/* LIST EXISTING COMMENTS */}
      </div>
      <div className='mt-6 md:mt-10'>
        <ReviewForm />
      </div>
    </div>
  );
};

export default Reviews;
