const {ethers} = require('ethers');
require('dotenv').config();

async function httpAddnewTransaction(req, res) {
    let payload = req.body;

    if (!payload.message || !payload.signature || !payload.signer) {
        return res.status(400).json({
            message: 'Invalid payload structure'
        });
    }

    let realSigner = await verifySignature(payload);
    console.log(realSigner);
    console.log(JSON.stringify(payload.message));

    if (realSigner!== payload.signer) {
        return res.status(400).json({
            message: 'Invalid payload signer/ signature'
        });
    }

    let newTx = await buildNewTx(payload);
    let status = submitTransaction(newTx);


    res.status(200).json({
        message: 'Transaction added successfully',
        data: req.body,
    });
}

async function buildNewTx(payload) {
    let newPayload = JSON.stringify({payload: payload.message, caller: payload.signer});
    // console.log(`payload is: ${JSON.stringify(payload)}`);

    let target = await JSON.parse(payload.message).target;
    let data = await JSON.parse(payload.message).data;

    let newTx = {
        target: target,
        data: data,
        signer: payload.signer,
    };
    // console.log(`target is: ${JSON.stringify(target)}`);
    // console.log(`Data is: ${JSON.stringify(data)}`);
    // console.log(`new tx is: ${JSON.stringify(newTx)}`);
    // console.log(newPayload);
    return newTx;
}

async function verifySignature(payload) {
    // console.log(`payload is: ${JSON.stringify(payload)}`);
    try {
        let realSigner = await ethers.utils.verifyMessage(JSON.stringify(payload.message), payload.signature);
        return realSigner;
    } catch (err) {
        console.log(err);
    }
}


async function submitTransaction(newTx) {

    let fee = ethers.BigNumber.from("1000000000000000000");
    let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const relayerAddress = process.env.RELAYER_ADDRESS;
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('Private key not found in .env file');
    }

    const signer = new ethers.Wallet(privateKey, provider);
    const abi = [
        "function relayInput(address target, uint256 fee, address caller, bytes memory payload) external returns(bool)"
    ];
    let txHex = await objectToHex(newTx);
    console.log(`Hex representation is: ${txHex}`);
    const contract = new ethers.Contract(relayerAddress, abi, signer);
    // let tx = await contract.relayInput(newTx.target, fee, newTx.signer, newTx, {gasLimit: 1000000});
    let tx = await contract.relayInput(newTx.target, fee, newTx.signer, txHex, {gasLimit: 1000000});
    const receipt = await tx.wait();
    console.log(tx);
}

async function objectToHex(obj) {
    const jsonString = JSON.stringify(obj);
    const buffer = Buffer.from(jsonString, 'utf8');
    const hexString = '0x' + buffer.toString('hex');
    return hexString;
}

module.exports = {
    httpAddnewTransaction
};