import { hexToString } from "viem";
import type { Address, Hex } from "viem";

type decodedPayload = {
  sender_address: Address;
  sender_payload: Hex;
};

export const extractData = (payload: Hex): decodedPayload => {
  // Assuming our payload object is formatted as sender_address:sender_payload
  const hexString = hexToString(payload);
  const parsedPayload = JSON.parse(hexString);
  let decoded: decodedPayload = {
    sender_address: parsedPayload.sender_address as Address,
    sender_payload: parsedPayload.sender_payload as Hex,
  };
  console.log(decoded);

  return decoded;
};


// extractData(`0x7b2273656e6465725f61646472657373223a22307831323334353637383930616263646566222c202273656e6465725f7061796c6f6164223a223078616263646566227d`);