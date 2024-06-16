import { Container } from './Container';
import child_abi from '../utils/child_abi.json';
import relayer_abi from '../utils/relayer_abi.json';
import relayer_address from '../utils/relayer_address';
import factory_abi from '../utils/factory_abi.json';
import factory_address from '../utils/factory_address';
import { UserOperation, Transaction } from "@biconomy/core-types";
import CTSI_abi from '../utils/CTSI_abi.json';
import CTSI_address from '../utils/CTSI_Address';

import React, { Provider, useEffect, useState } from 'react';

import { clsx } from 'clsx';
import { Address, useContractReads, useAccount, useContractRead, useContractWrite, useWaitForTransaction, usePrepareContractWrite } from 'wagmi';
import { Button } from './ui/button';


import { RelayClient } from '@openzeppelin/defender-relay-client';

const Web3 = require('web3');
import Lambda from 'aws-sdk/clients/lambda';


import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,
  IHybridPaymaster,  
  PaymasterMode,
  SponsorUserOperationDto,
} from '@biconomy/paymaster'
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";



export function IssueCertificate() {

    const [balance, setBalance] = useState<number>(0);
    const [nonce, setNonce] = useState<number>(0);
    const [owner, setOwner] = useState('');
    
    const [targetAddress, setTargetAddress] = useState("");
    const [Value, setValue] = useState(0);
    const [calldata, setCalldata] = useState("");
    const [transactionProcessed, setTransactionProcessed] = useState<Boolean>(false);
    
    const [depositValue, setDepositValue] = useState(0);
    const [depositStatus, setDepositStatus] = useState<Boolean>(false);
    
    const [withdrawalAmount, setWithdrawalAmount] = useState(0);
    const [WithdrawalStatus, setWithdrawalStatus] = useState<Boolean>(false);
    const [singleAccount, setSingleAccount] = useState("");
    const [connectedAddr, setConnectedAddr] = useState("");
    const { address } = useAccount();
    const [withdrawing, setWithdrawing] = useState<Boolean>(false);
    const [depositing, setDepositing] = useState<Boolean>(false);
    
    // const [address, setAddress] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)
    const [avalableAllowance, setAvailableAllowance] = useState(0);
const bundler: IBundler = new Bundler({
    bundlerUrl: `https://bundler.biconomy.io/api/v2/${ChainId.GOERLI}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`, // bundler URL from dashboard use 84531 as chain id if you are following this on base goerli,    
    chainId: ChainId.GOERLI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/5/peE1TtqEY.5ce39aaf-609a-41db-b29a-e99fc4269131",// paymaster url from dashboard 
  })

  interface Props {
    smartAccount: BiconomySmartAccountV2,
    address: string,
    provider: ethers.providers.Provider,
  }
  



// const IssueCert = async () => {
//     console.log("creating vest");
//     issueCertWrite?.();
// };

const fundGasTank = async () => {
    setDepositing(true);
    console.log(`Available Allowance is: ${avalableAllowance}`)
    console.log(`Intended Amount is: ${ethers.utils.parseEther(depositValue.toString())}`)
    // fundGasTankFunc?.();
    // grantAllowanceFunc?.();
    
    if (ethers.BigNumber.from(avalableAllowance.toString()) >= ethers.utils.parseEther(depositValue.toString())) {
        console.log("Funding Gas Tank");
        fundGasTankFunc?.();
    } else {
        console.log("Insufficient funds.... Granting Alowance");
        grantAllowanceFunc?.();
    }
    setDepositing(false)
};
const withdrawFromTank = async () => {
    console.log("WITHDRAWING FROM GAS TANK");
    try {
        setWithdrawing(true);
        withdrawFromTankWrite?.();
        setWithdrawing(false);

    } catch(err) {
        console.log(err);
        setWithdrawing(false);
    }
};


    // GRANT ALLOWANCE TO GAS TANK
    const { config: GrantAllowanceConfig } = usePrepareContractWrite({
        address: CTSI_address as Address,
        abi: CTSI_abi,
        functionName: "approve",
        args: [singleAccount as Address, depositValue * 1000000000000000000]
    });

    const { data: grantAllowanceData, isLoading: grantAllowanceIsLoading, isError: grantAllowanceIsError, write: grantAllowanceFunc, isSuccess: Successfully } = useContractWrite(GrantAllowanceConfig);
    const waitForTransaction = useWaitForTransaction({
        hash: grantAllowanceData?.hash,
        onSuccess(data) {
          setDepositStatus(true);
          console.log('Success', data);
            fundGasTankFunc?.();

        },
      })


    // DEPOSIT INTO GAS TANK
    const { config: IssueCertConfig2 } = usePrepareContractWrite({
        address: singleAccount as Address,
        abi: child_abi,
        functionName: "fundGasTank",
        args: [depositValue * 1000000000000000000]
    });

    const { data: fundGasTankFunctData, isLoading: fundGasTankFuncIsLoading, isError: fundGasTankFuncIsError, write: fundGasTankFunc, isSuccess: Successfully2 } = useContractWrite(IssueCertConfig2);
    const waitForTransaction2 = useWaitForTransaction({
        hash: fundGasTankFunctData?.hash,
        onSuccess(data) {
          setDepositStatus(true);
          console.log('Success', data)
        },
      })

    // WITHDRAW FROM GAS TANK
    const { config: IssueCertConfig3 } = usePrepareContractWrite({
        address: singleAccount as Address,
        abi: child_abi,
        functionName: "withdrawGas",
        args: [withdrawalAmount * 1000000000000000000],
    });
    const { data: withdrawFromTankData, isLoading: withdrawFromTankIsLoading, isError: withdrawFromTankIsError, write: withdrawFromTankWrite, isSuccess: Successfully3 } = useContractWrite(IssueCertConfig3);
    const waitForTransaction3 = useWaitForTransaction({
        hash: withdrawFromTankData?.hash,
        onSuccess(data) {
          setWithdrawalStatus(true);
          console.log('Success', data)
        },
      })      


    const { data: dappAddress, isLoading: dappAddressLoading, isError: dappAddressError } = useContractRead({
        address: factory_address as Address,
        abi: factory_abi,
        functionName: "userToDappAddress",
        watch: true,
        args: [connectedAddr ?? "0x00", 0],
    });
    

    const { data: gasTankAddress, isLoading: gasTankAddressIsLoading, isError: gasTankAddressIsError } = useContractRead({
        address: factory_address,
        abi: factory_abi,
        functionName: "getGatTankAddress",
        watch: true,
        args: [dappAddress ?? "0x00"],
    });

      const { data: TxCount, isLoading: TxCountLoading, isError: TxCountError } = useContractRead({
        address: relayer_address as Address,
        abi: relayer_abi,
        functionName: "targetTxCounter",
        watch: true,
        args: [dappAddress ?? "0x00"],
    });
      const { data: certAddr3, isLoading: yourCertIsLoading3, isError: yourCertIsError3 } = useContractRead({
        address: gasTankAddress as Address,
        abi: child_abi,
        functionName: "gasTankBalance",
        watch: true,
    });

    const { data: tankAllowance, isLoading: tankAllowanceLoading, isError: tankAllowanceError } = useContractRead({
        address: CTSI_address,
        abi: CTSI_abi,
        watch: true,
        functionName: "allowance",
        args: [connectedAddr ?? "0x00", gasTankAddress ?? "0x00"],
    });

    


    useEffect(() => {

        setConnectedAddr(address as Address);
        console.log(`final child addr:`, gasTankAddress);
        setSingleAccount(gasTankAddress as Address);
        setNonce(TxCount as number);
        setBalance(certAddr3 as number);
        console.log(`balance is ${certAddr3 }`)
        setOwner(dappAddress as Address);
        console.log(`Tank allowance is ${tankAllowance}`);
        setAvailableAllowance( tankAllowance as any);

        console.log(`Wallet Ballance:`, certAddr3);

    }, [address, gasTankAddress, connectedAddr, TxCount]);


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
        <div className='pt-8'>
        <Container className={clsx("pt-20 pb-16 lg:pt-12 flex flex-row gap-8 justify-center")}>
            <div className={clsx("flex flex-col gap-8 mt-4 px-8 py-8  bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl text-center")}>
                <p>
                    GAS TANK ADDRESS:
                </p>
                <p>
                    {gasTankAddress ? `${gasTankAddress.toString().slice(0,10)}.... ${gasTankAddress.toString().slice(-10)}` : '------'}
                </p>
            </div>
            <div className={clsx("flex flex-col gap-8 mt-4 px-8 py-8  bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl text-center")}>
                <p>
                    BALLANCE:
                </p>
                <p>
                    {balance ? `${(Number(balance) /10**18)?.toString()} CTSI`: '-----'}
                </p>
            </div>
            <div className={clsx("flex flex-col gap-8 mt-4 px-8 py-8  bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl text-center")}>
                <p>
                   NONCE:
                </p>
                <p>
                    {nonce >= 0 ? nonce.toString(): '-----'}
                </p>
            </div>
            <div className={clsx("flex flex-col gap-8 mt-4 px-8 py-8  bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl text-center")}>
                <p>
                   DAPP ADDRESS:
                </p>
                <p>
                    {owner ? `${owner.slice(0,10)}...${owner.slice(-10)}` : '-----' }
                </p>
            </div>
        </Container> 

        <Container className="pt-20 pb-16 lg:pt-10">
            <form className={clsx("flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl")}>
                <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
                    DEPOSIT
                </h2>
                <div className='space-y-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="token_amount"> Amount</label>
                        <input
                            type="number"
                            name="token_amount"
                            id=""
                            onChange={(e) => { setDepositValue(Number(e.target.value)); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 '
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <Button type='button' onClick={fundGasTank} disabled={false}>
                    { depositing ? <Spinner /> : `Deposit`    }   
                    </Button>
                </div>

            </form>
        </Container>

        <Container className="pt-20 pb-16 lg:pt-5">
            <form className={clsx("flex flex-col gap-8 mt-4 px-8 py-8 m-auto bg-zinc-50 shadow-2xl shadow-zinc-200 rounded-lg ring-1 ring-zinc-200 lg:max-w-2xl")}>
                <h2 className="mx-auto max-w-4xl font-display text-4xl font-medium tracking-tight text-slate-900 ">
                    WITHDRAW
                </h2>
                <div className='space-y-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="token_amount"> Amount</label>
                        <input
                            type="number"
                            name="token_amount"
                            id=""
                            onChange={(e) => { setWithdrawalAmount(Number(e.target.value)); }}
                            className='w-full shadow-inner p-2 px-4 ring-1 ring-zinc-200 rounded-md outline-none bg-zinc-50 '
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    <Button type='button' onClick={withdrawFromTank} disabled={false}>
                    { withdrawing ? <Spinner /> : `Withdraw`    }   
                    </Button>
                    
                </div>

            </form>
        </Container>

        
        </div>

    );
}
