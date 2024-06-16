import Image from 'next/image';
import { Container } from '../components/Container';
import factory_abi from '../utils/factory_abi.json';
import factory_address from '../utils/factory_address';
import CTSI_abi from '../utils/CTSI_abi.json';
import CTSI_address from '../utils/CTSI_Address';
import { shortenHex } from "../utils/ShortenHex";

import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Address, useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { Button } from './ui/button';


export function CreateCertificate() {

    const [dAppAddress, setDAppAddress] = useState('');
    // const [RecoveryAddress2, setRecoveryAddress2] = useState('');
    // const [RecoveryAddress3, setRecoveryAddress3] = useState('');
    // const [salt, setsalt] = useState(0);
    const [singleAccount, setSingleAccount] = useState("");
    const [addressCreated, setAddressCreated] = useState<Boolean>(false);
    const [addr, setAddr] = useState("");
    const [hasAccount, sethasAccount] = useState<Boolean>(false);
    const [connectedAddr, setConnectedAddr] = useState("");
    const [creating, setCreating] = useState<Boolean>(false);
    


    const { address } = useAccount();


    const CreateCert = async () => {
        try {
            setCreating(true);
            console.log("creating gas Tank");
            console.log(`DappAddress is ${dAppAddress}`);
            await createCertWrite?.();
            console.log("Gas tank created successfully");
            setCreating(false);
        } catch(err) {
            console.log(err);
            setCreating(false);
        }
    };

    const { config: CreateCertConfig } = usePrepareContractWrite({
        address: factory_address,
        abi: factory_abi,
        functionName: "createGasTank",
        args: [dAppAddress],
    });

    const { data: createCertData, isLoading: createCertIsLoading, isError: createCertIsError, write: createCertWrite } = useContractWrite(CreateCertConfig);

    const waitForTransaction = useWaitForTransaction({
      hash: createCertData?.hash,
      onSuccess(data) {
        setAddressCreated(true);
        console.log('Success', data)
      },
    })

    const { data: dappAddress, isLoading: dappAddressIsLoading, isError: dappAddressIsError } = useContractRead({
        address: factory_address,
        abi: factory_abi,
        watch: true,
        functionName: "userToDappAddress",
        args: [connectedAddr, 0],
    });



    const { data: tankAddress, isLoading: yourCertIsLoading, isError: yourCertIsError } = useContractRead({
        address: factory_address,
        abi: factory_abi,
        watch: true,
        functionName: "getGatTankAddress",
        args: [dappAddress ?? "0x00"],
    });

    const { data: tankAllowance, isLoading: tankAllowanceLoading, isError: tankAllowanceError } = useContractRead({
        address: CTSI_address,
        abi: CTSI_abi,
        watch: true,
        functionName: "allowance",
        args: [connectedAddr ?? "0x00", tankAddress ?? "0x00"],
    });

    const { data: _hasAccount, isLoading: hasAccountIsLoading, isError: hasAccountIsError } = useContractRead({
        address: factory_address,
        abi: factory_abi,
        watch:true,
        functionName: "hasAGasTank",
        args: [connectedAddr ?? "0x00"],
    });

    useEffect(() => {

        setConnectedAddr(address as Address);
        console.log(`users gas tank is:`, tankAddress);
        setSingleAccount(tankAddress as Address);
        sethasAccount(_hasAccount as boolean);

    }, [address, addressCreated, connectedAddr, tankAllowance]);



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
        <div className=' pt-24'>
           {hasAccount || addressCreated ? (<Container className={clsx("pt-20 pb-16 lg:pt-12")}>
            <div className={clsx("flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl text-center")}>
                <p>
                    GAS TANK CREATED SUCCESFULLY.
                </p>
                <p>
                    YOUR GAS TANK ADDRESS IS:
                </p>
                <p>
                    {singleAccount}
                </p>
            </div>
        </Container>) 
        : 
        (<Container className={clsx("pt-20 pb-16 lg:pt-12")}>
            <form className={clsx("flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl")}>
                <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
                    Create Gas Tank
                </h2>

                <div className='space-y-4'>

                    <div className='flex flex-col gap-2'>
                        <label htmlFor="cert_name">dApp Contract Address</label>
                        <input
                            type="text"
                            name="cert_name"
                            id=""
                            onChange={(e) => { setDAppAddress(e.target.value);}}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50'
                        />
                    </div>
                </div>
                <Button type='button' className='max-w-max ml-auto' onClick={CreateCert}>
                { creating ? <Spinner /> : `Create Gas Tank`    }   
                
                </Button>
            </form>
        </Container>
        )}
        
        
        </div>





    );
}
