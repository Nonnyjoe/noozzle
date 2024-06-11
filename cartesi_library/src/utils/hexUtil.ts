import { hexToString } from "viem";

export const convertToString = (payload: string) => {
  const value = hexToString(`0x${payload}`);
  return value;
};
