import Image from 'next/image';
import { ButtonLink } from '../components/Button';
import { Container } from '../components/Container2';
import factory_abi from '../utils/factory_abi.json';
import factory_address from '../utils/factory_address';
import relayer_abi from '../utils/relayer_abi.json';
import relayer_address from '../utils/relayer_address';
import child_abi from '../utils/child_abi.json';
import React, { SetStateAction, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { clsx } from 'clsx';
import { type  Address, useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Button } from './ui/button';
import { useDisclosure } from '@chakra-ui/react'
import  {Verified} from './components/Verified';
import ErrorDialog from './components/Error';
import GetTransactionData from './TransactionData';

export function VerifyCertificate() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [verifiedStatus, setVerifiedStatus] = useState(false);
    const [ErrorStatus, setErrorStatus] = useState(false);

    const [connectedAddr, setConnectedAddr] = useState("");
    const [singleAccount, setSingleAccount] = useState("");
    const [newAddress, setNewAddress] = useState("");
    const [targetAddress, setTargetAddress] = useState("");
    const [requestId, setRequestId] = useState(0);
    const [inputRequestId, setInputRequestId] = useState(0);
    const [dapAddress, setDapAddress] = useState("");
    const [gasTank, setGasTank] = useState("");
    const [txCount, setTxCount] = useState<number>(0);
    
    const [verifiedCertificateData, setVerifiedCertificateData] = useState<VerifiedCertificateDetails>();
    
      // State to store the selected contract address
    const [selectedContract, setSelectedContract] = useState<string | null>(null);
    const [tokenWithdrawn, settokenWithdrawn] = useState<boolean>(false);
    
    
    const {address} = useAccount();
    
  
    const verifyByHash = () => {
        console.log("Verifying cert by hash")
        // setVerifiedStatus(true)
        // setErrorStatus(true)
        createCertWrite?.()
    }     
    
    //GET DAPP ADDRESS
    const { data: dappAddress, isLoading: dappAddressLoading, isError: dappAddressError } = useContractRead({
        address: factory_address as Address,
        abi: factory_abi,
        functionName: "userToDappAddress",
        watch: true,
        args: [connectedAddr ?? "0x00", 0],
    });
    
    //GET TANK ADDRESS
    const { data: gasTankAddress, isLoading: gasTankAddressIsLoading, isError: gasTankAddressIsError } = useContractRead({
        address: factory_address,
        abi: factory_abi,
        functionName: "getGatTankAddress",
        watch: true,
        args: [dappAddress ?? "0x00"],
    });

    // GET THE TOTAL TRANSACTION EXECUTED
    const { data: TxCount, isLoading: TxCountLoading, isError: TxCountError } = useContractRead({
        address: relayer_address as Address,
        abi: relayer_abi,
        functionName: "targetTxCounter",
        watch: true,
        args: [dappAddress ?? "0x00"],
    });


        // GET THE TRANSACTION EXECUTED
        const { data: TxData, isLoading: TxDataLoading, isError: TxDataError } = useContractRead({
            address: relayer_address as Address,
            abi: relayer_abi,
            functionName: "txStructData",
            watch: true,
            args: [dappAddress ?? "0x00", 1],
        });


        // GET A USERS SMART WALLET ACCOUNT
      const { data: certAddr, isLoading: yourCertIsLoading, isError: yourCertIsError } = useContractRead({
        address: factory_address,
        abi: factory_abi,
        functionName: "getUserAddress",
        args: [connectedAddr ?? "0x00"],
    });


    useEffect(() => {
        setConnectedAddr(address as Address);
        console.log(`final child addr:`, certAddr);
        setSingleAccount(certAddr as Address);
        setDapAddress(dappAddress as Address);
        setTxCount(TxCount as number);
        setGasTank(gasTankAddress as Address);

        console.log(`final1 ${dappAddress}`);
        console.log(`fina2 ${gasTankAddress}`);
        console.log(`fina3 ${TxCount}`);

        // console.log(`fina5 ${(TxData as any)[2]}`);

    }, [address, certAddr, connectedAddr, TxCount]);
    

    function stringToJson(data: string) {
        return JSON.parse(data);
    }

    // REQUEST RECOVERY
    const { config: CreateCertConfig } = usePrepareContractWrite({
        address: singleAccount as Address,
        abi: child_abi,
        functionName: "requestRecovery",
        args: [requestId, newAddress],
    });
    const { data: createCertData, isLoading: createCertIsLoading, isError: createCertIsError, write: createCertWrite, isSuccess: Successfully } = useContractWrite(CreateCertConfig);
   
    // AUTORIZE RECOVERY
    const { config: CreateCertConfig1 } = usePrepareContractWrite({
        address: targetAddress as Address,
        abi: child_abi,
        functionName: "autorizeRecovery",
        args: [inputRequestId],
    });
    const { data: createCertData1, isLoading: createCertIsLoading1, isError: createCertIsError1, write: createCertWrite1, isSuccess: Successfully1 } = useContractWrite(CreateCertConfig1);
    // console.log((Number(txCount)));

    const transactions = Array.from({ length: Number(txCount) }, (_, i) => i + 1);


  // Function to handle card click and update selectedContract state
  const handleCardClick = (contractAddress: string) => {
    setSelectedContract(contractAddress);
  };
    
    return (
        <div className=' pt-10'>
        <Container className={clsx("pt-20 pb-16 lg:pt-12")}>
            {verifiedStatus && verifiedCertificateData && <Verified open={isOpen} close={onClose} data={verifiedCertificateData} />}
            {ErrorStatus && <ErrorDialog open={isOpen} close={onClose} />}
            <form className={clsx("flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl")}>
                <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
                    TRANSACTION PROCESSED
                </h2> 
                    <div className='flex flex-col gap-2 pt-10 pb-20 text-center'>
                        {txCount ? transactions.map((txID) => (
                            <GetTransactionData key={txID} dappAddress={dappAddress as string} txId={txID} />
                        )) : `No Metatransactions relayed yet......`}
                    </div>
                </form> 
        </Container>

        </div>

    );
}

export type VerifiedCertificateDetails = 
{ 
    Name: string, 
    addr: Address, 
    certificateId: 0n, 
    certificateUri: string, 
    issuedTime: number; 
}