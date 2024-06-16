import React from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/solid';
import { useState } from 'react'
import { ethers } from "ethers";
import dappAddress from '../utils/dappAddress';
import axios from 'axios';
import https from 'https';


const ReviewForm = () => {
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

      let {address, signature} = await signMessage((message));
      let finalPayload = createMessage(message, dappAddress, address, signature);
      console.log(finalPayload);

      let realSigner = await ethers.utils.verifyMessage(finalPayload.message, finalPayload.signature);

      console.log(`Realsigner is: ${realSigner}`);
      await sendTransaction(finalPayload);

      setReview('')
      setSubmiting(false);
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
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
            const response = await axios.post('https://noozzle-lvaf.vercel.app/transactions', data, {
                // httpsAgent: agent,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Transaction successful:', response.data);
        } catch (error) {
            console.error('Error sending transaction:', error.response ? error.response.data : error.message);
        }
    }



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
            className=" mt-[-7px] inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:bg-gray-600"
            >
            <PaperAirplaneIcon className="h-8 w-5 text-white" aria-hidden="true" />
            </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm