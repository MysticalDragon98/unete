import { Server as UneteServer } from "@unete/io";
import { HTTPServer } from "./http-proxy";

export interface ServerOptions {
    port: any;
    endpoints: any;
    responseType?: "object" | "raw";

    ssl?: {
        key: string;
        cert: string;
        ca: string;
    }
}

let __tempServer__;
export class Server extends UneteServer {

    httpServer: HTTPServer;

    constructor (private options: ServerOptions) {
        super(options.endpoints, (__tempServer__ = new HTTPServer({
            port: options.port,
            endpoints: options.endpoints,
            responseType: "object",
            ssl: options.ssl
        })).server);

        this.httpServer = __tempServer__;
    }

    listen () {
        return this.httpServer.init();
    }

}