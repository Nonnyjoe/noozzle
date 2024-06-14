
import relayer_abi from '../utils/relayer_abi.json';
import relayer_address from '../utils/relayer_address';
import child_abi from '../utils/child_abi.json';
import React, { SetStateAction, useEffect, useState } from 'react';
import { type  Address, useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { ethers } from 'ethers';

interface VerifyCertificateProps {
    dappAddress: string;
    txId: number;
  }


  const GetTransactionData: React.FC<VerifyCertificateProps> = ({ dappAddress, txId }) => {
    const [txData, setTxData] = useState<any>();
    const [txIdd, setTxIdd] = useState<any>();
    const [txFee, setTxFee] = useState<any>();
    const [txCaller, setTxCaller] = useState<any>();
    const [txRelayer, setTxRelayer] = useState<any>();


        // GET THE TRANSACTION EXECUTED
        const { data: TxData, isLoading: TxDataLoading, isError: TxDataError } = useContractRead({
            address: relayer_address as Address,
            abi: relayer_abi,
            functionName: "txStructData",
            watch: true,
            args: [dappAddress ?? "0x00", txId],
        });


        useEffect(() => {
            setTxData(TxData as any);
            setTxIdd(TxData ? ((TxData as any)[0]) : '-----');
            setTxFee(TxData ? ((TxData as any)[1]) : "-------");
            setTxCaller(TxData ? ((TxData as any)[2]) : "-------");
            setTxRelayer(TxData ? ((TxData as any)[3]) : "-------");
            // console.log(`fina5 ${(TxData as any)[2]}`);
            console.log((ethers.utils.parseEther((1000000000000000000).toString())));
        }, [TxData]);



        return (
            <div>
                <div className='d flex flex-row gap-9 mb-5'>
                    <div>{txIdd ? `${(txIdd).toString()}.0`: '-----'}</div>
                    <div>{txFee ? `${(txFee / BigInt(1000000000000000000)).toString()} CTSI`: '-----'}</div>
                    <div>{txCaller ? `${txCaller.toString().slice(0,10)} ...... ${txCaller.toString().slice(0,10)}`: '------'}</div>
                    <div>{txRelayer ? `${txRelayer.toString().slice(0,10)} ...... ${txRelayer.toString().slice(0,10)}`: '------'}</div>
                </div>
            </div>
        );

}

export default GetTransactionData;