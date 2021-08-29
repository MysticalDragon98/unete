/// <reference types="node" />
import * as http from 'http';
import * as https from 'https';
export interface HTTPOptions {
    port: any;
    endpoints: any;
    responseType?: "object" | "raw";
    ssl?: {
        key: string;
        cert: string;
        ca: string;
    };
    static?: string[];
}
export declare class HTTPServer {
    options: HTTPOptions;
    app: any;
    server: http.Server | https.Server;
    constructor(options: HTTPOptions);
    init(): Promise<unknown>;
}
