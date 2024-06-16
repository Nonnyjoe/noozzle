// Import the necessary modules and functions
import { hexToString } from "viem";
// Import specific Jest functions
import { describe, it, expect, jest } from "@jest/globals";
import { extractData } from "../src";
// Mock the hexToString function from viem
jest.mock("viem", () => ({
    hexToString: jest.fn(),
}));
describe("extractData", () => {
    it("should extract and decode the payload correctly", () => {
        // Define the mock implementation of hexToString
        hexToString.mockImplementation((payload) => {
            return '{"sender_address":"0x1234567890abcdef", "sender_payload":"0xabcdef"}';
        });
        const testPayload = "0x7b2273656e6465725f61646472657373223a22307831323334353637383930616263646566222c202273656e6465725f7061796c6f6164223a223078616263646566227d"; // Example hex payload
        // Call the function with a test payload
        const result = extractData(testPayload);
        // Assert the result
        expect(result).toEqual({
            sender_address: "0x1234567890abcdef",
            sender_payload: "0xabcdef",
        });
    });
    it("should throw an error for invalid JSON", () => {
        // Define the mock implementation of hexToString to return invalid JSON
        hexToString.mockImplementation((payload) => {
            return "invalid JSON";
        });
        const testPayload = "0x7b226e616d65223a2268656c6c6f227d"; // Example hex payload
        // Assert that the function throws an error for invalid JSON
        expect(() => extractData(testPayload)).toThrow(SyntaxError);
    });
});
