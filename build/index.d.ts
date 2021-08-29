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
    };
}
export declare class Server extends UneteServer {
    private options;
    httpServer: HTTPServer;
    constructor(options: ServerOptions);
    listen(): Promise<unknown>;
}
