import { hexToString } from "viem";
import type { Address, Hex } from "viem";

type DecodedPayload = {
  messenger: Address;
  message: string;
};

/**
 * Extracts and decodes data from a hex-encoded payload.
 *
 * @param {Hex} payload - The hex-encoded string to decode.
 * @returns {DecodedPayload} The decoded payload containing the messenger and message fields.
 * @throws Will throw an error if the payload format is invalid, conversion fails, or JSON parsing fails.
 */
export const extractData = (payload: Hex): DecodedPayload => {
  try {
    // Ensure the payload starts with '0x'
    if (!payload.startsWith('0x')) {
      throw new Error("Invalid payload format: Payload must start with '0x'");
    }

    // Convert hex to string
    let hexString: string;
    try {
      hexString = hexToString(payload);
    } catch (error) {
      throw new Error(`Failed to convert hex to string: ${error}`);
    }

    // Parse JSON
    let parsedPayload: any;
    try {
      parsedPayload = JSON.parse(hexString);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }

    // Validate parsed payload
    if (!parsedPayload.messenger || !parsedPayload.message) {
      throw new Error("Invalid parsed payload: Missing 'messenger' or 'message'");
    }

    // Create decoded payload
    const decoded: DecodedPayload = {
      messenger: parsedPayload.messenger as Address,
      message: parsedPayload.message as string,
    };

    return decoded;

  } catch (error) {
    console.error(`Error extracting data: ${error}`);
    throw error;  // Re-throw the error after logging it
  }
};