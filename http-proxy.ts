const express = require('express');
const bodyParser = require('body-parser');
import * as http from 'http';
import * as https from 'https';

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { highlight, danger } from 'termx';
import { isObservable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { parse } from 'url';
import { log } from '@mysticaldragon/logger';
import { FunctionUtils, ObjectUtils } from '@mysticaldragon/utils';

export interface HTTPOptions {
    port: any;
    endpoints: any;
    responseType?: "object" | "raw";
    ssl?: {
        key: string;
        cert: string;
        ca: string;
    }

    static?: string[]
}

export class HTTPServer {

    app: any;
    server: http.Server | https.Server;

    constructor (public options: HTTPOptions) {
        ObjectUtils.setDefaults(this.options, {
            responseType: "object",
            static: []
        });

        this.app = express();
        this.server = options.ssl? https.createServer({
            key : readFileSync(resolve(process.cwd(), options.ssl.key)),
            cert: readFileSync(resolve(process.cwd(), options.ssl.cert)),
            ca  : readFileSync(resolve(process.cwd(), options.ssl.ca))
        }, this.app) : http.createServer(this.app);

        

        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(bodyParser.json({
            verify: (req: any, res: any, buf: any) => {
                (req as any).rawBody = buf
            }
        }));

        this.app.use(async (rq: any, rs: any) => {
            //? Parsing
                const { url, method } = rq;
                const URL = parse(url).pathname;
                const path = URL?.split('/').slice(1) || [];
                const body = method === "GET"? rq.query : rq.body;
        
                log("UNETE", `(${danger(rq.connection.remoteAddress)}) ${highlight(method)} - ${URL}`, body)
        
                let fn: any = this.options.endpoints;
                
            //? Routing
                for(const route of path) {
                    fn = FunctionUtils.getObjectPropertyIgnoreCase(fn, route)
        
                    if(!fn) return rs.status(404).end("Method " + URL + " not found.");
                }
                
                if(typeof fn !== "function") return rs.status(404).end("Method " + URL + " not found.");
        
            //? Executing
                const params = fn.params || FunctionUtils.getParamNames(fn);
                const args = [];
                
                if(params.includes("$request")) body.$request = rq;
        
                for(const i in body) body[i.replace(/[^a-z0-9]/gi, '').toLowerCase()] = body[i]; //? Ignore param case
                for(const param of params) {
                    try {
                        var res = JSON.parse(body[param.toLowerCase()]);
        
                        args.push(res);
                    } catch (exc) {
                        args.push(body[param.toLowerCase()]);
                    }
                }
        
                rs.header('Content-Type', 'application/json');
        
                try {
                    var result = await fn(...args);
        
                    if(result?.$raw) {
                        if(result.ctype) rs.header("Content-Type", result.ctype);
                        return rs.status(200).end(result.$raw)
                    }
                    else if (!Array.isArray(result) && isObservable(result)) result = await result.pipe(toArray()).toPromise();
                    
                    if (this.options.responseType === "object") rs.status(200).json({ result });
                    else if (this.options.responseType === "raw") rs.status(200).json(result);
                } catch (exc: any) {
                    log("UNETE", danger(rq.connection.remoteAddress), danger(exc.message || exc));

                    if (this.options.responseType === "object") rs.status(500).json({ error: exc.message })
                    else if (this.options.responseType === "raw") rs.status(500).json(exc.message);  
                    
                }
        });

    }

    async init () {
        for (const staticPath in this.options.static) {
            this.app.use(express.static(staticPath));
        }

        return await new Promise ((done, err) => {
            this.server.listen(this.options.port, () => {
                log("UNETE", "HTTP Server running at port:", highlight(this.options.port))
                done(null);
            })
        });
    }

}