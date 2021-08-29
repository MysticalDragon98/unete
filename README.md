# @mysticaldragon/unete

Unete is a microservice framework that exposes an HTTP & Socket.IO server based on native JS functions.
Socket.IO server can be used to return observables that can be read in the @unete/io client.

## Options

```js
{
    port: any;
    endpoints: any;
    responseType?: "object" | "raw"; // Default: "object", if = "raw", results won't be parsed as JSON

    ssl?: { // If != undefined, will expose the server as https:// & wss://
        key: string;
        cert: string;
        ca: string;
    }
}
```

## Usage Example

```js
import { Server } from "@mysticaldragon/unete";

new Server({
    port: 8080,
    endpoints: {
        helloWorld () {
            return "Hello World!";
        }
    }
}).listen();
```

Then enter http://localhost:8080/helloWorld

## Response

### If Options.responseType == "object"

If the function success, it will return 200 - { result }
If the function throws an exception, it will return 500 - { error }


### If Options.responseType == "raw"

If the function success, it will return 200 - result
If the function throws an exception, it will return 500 - error