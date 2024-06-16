import React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/solid';
import { useState } from 'react'
import { ethers } from "ethers";
import dappAddress from '../utils/dappAddress';
import axios from 'axios';
import https from 'https';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewForm = () => {
  const showToastSuccess = (message) => {
    toast.success(message, {});
  };

  const showToastInfo = (message) => {
    toast.info(message, {});
  };

  const showToastError = (message) => {
    toast.error(message, {  });
  };


    const [review, setReview] = useState('');
    const [submiting, setSubmiting] = useState(false);
   

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    const handleSubmit = async(e) => {

      e.preventDefault()
      setSubmiting(true);
      // Handle form submission logic here
      let message = {
        data: review,
        target: dappAddress
      };
      try {
        let {address, signature} = await signMessage((message));
        let finalPayload = createMessage(message, dappAddress, address, signature);
        console.log(finalPayload);
        showToastInfo('Sending transaction to relayer....');

        let realSigner = await ethers.utils.verifyMessage(finalPayload.message, finalPayload.signature);

        console.log(`Realsigner is: ${realSigner}`);
        await sendTransaction(finalPayload);

        setReview('')
        setSubmiting(false);
        showToastSuccess('Transaction relayed successfully');
      } catch (err) {
        console.log(err.message);
        setSubmiting(false);
        // showToastError(err.message);
      }
    }


    async function signMessage(message) {
        try {
            console.log(JSON.stringify(message));
            if (!window.ethereum)
              throw new Error("No crypto wallet found. Please install it.");
        
            await window.ethereum.send("eth_requestAccounts");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            // console.log(JSON.stringify(message));
            const signature = await signer.signMessage(JSON.stringify(message));

            // console.log(`signature verified is ${signature}`);
            const address = await signer.getAddress();
        
            // console.log(`Data to be sent is: ${JSON.stringify({ message, signature, address })}`);
            return {address, signature};
          } catch (err) {
            showToastError(err.message);
            console.log(err.message);
            setSubmiting(false);
          }
    }

    function createMessage(data, target, signer, signature) {
        // Stringify the message object
        const messageString = JSON.stringify(data);
    
        // Construct the final JSON object
        const finalObject = {
            message: messageString,
            signer: signer,
            signature: signature
        };
    
        return finalObject;
    }



    async function sendTransaction(data) {
        try {
            const response = await axios.post('https://noozzle.onrender.com/transactions', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Transaction successful:', response.data);
        } catch (error) {
            console.error('Error sending transaction:', error.response ? error.response.data : error.message);
        }
    }


    const Spinner = () => (
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );


  return (
    <div className=" mx-auto mt-10 p-4 rounded-3xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-4 flex gap-5 content-center justify-items-center justify-center ">
        <div className='  w-full'>
          {/* <label htmlFor="review" className="block text-sm font-medium text-gray-700">
            Your Review
          </label> */}
          <textarea
            id="review"
            name="review"
            rows="2"
            placeholder='Your Review'
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>
        <div className=''>
            <button
            type="submit"
            disabled={submiting}
            className=" mt-[-7px] inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-500 disabled:h-12"
            >
              {submiting ? <Spinner /> : <PaperAirplaneIcon className="h-8 w-5 text-white" aria-hidden="true" />}
            </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm