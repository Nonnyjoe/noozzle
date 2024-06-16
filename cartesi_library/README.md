# Noozzle 

The `noozzle` minimal package provides a utility function to decode and extract data from a hex-encoded payload received by the Relayer contract. It converts the hex string to a JSON object and extracts the `messenger` and `message` fields.

## Installation

Install the package using npm:

```sh
npm install noozzle
```

## Import the function

```javascript
import { extractData } from "noozzle";
```

## Example Usage

```javascript
const payload: Hex = "0x7b226d657373656e676572223a22307831323334353637383930616263646566222c20226d657373616765223a223078616263646566227d";

try {
  const decodedData = extractData(payload);
  console.log(decodedData);
} catch (error) {
  console.error(`Failed to extract data: ${error.message}`);
}
```