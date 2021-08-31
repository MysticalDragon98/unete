"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServer = void 0;
const express = require('express');
const bodyParser = require('body-parser');
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const fs_1 = require("fs");
const path_1 = require("path");
const termx_1 = require("termx");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const url_1 = require("url");
const logger_1 = require("@mysticaldragon/logger");
const utils_1 = require("@mysticaldragon/utils");
class HTTPServer {
    constructor(options) {
        this.options = options;
        utils_1.ObjectUtils.setDefaults(this.options, {
            responseType: "object",
            static: []
        });
        this.app = express();
        this.server = options.ssl ? https.createServer({
            key: (0, fs_1.readFileSync)((0, path_1.resolve)(process.cwd(), options.ssl.key)),
            cert: (0, fs_1.readFileSync)((0, path_1.resolve)(process.cwd(), options.ssl.cert)),
            ca: (0, fs_1.readFileSync)((0, path_1.resolve)(process.cwd(), options.ssl.ca))
        }, this.app) : http.createServer(this.app);
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({
            verify: (req, res, buf) => {
                req.rawBody = buf;
            }
        }));
        this.app.use((rq, rs) => __awaiter(this, void 0, void 0, function* () {
            //? Parsing
            const { url, method } = rq;
            const URL = (0, url_1.parse)(url).pathname;
            const path = (URL === null || URL === void 0 ? void 0 : URL.split('/').slice(1)) || [];
            const body = method === "GET" ? rq.query : rq.body;
            (0, logger_1.log)("UNETE", `(${(0, termx_1.danger)(rq.connection.remoteAddress)}) ${(0, termx_1.highlight)(method)} - ${URL}`, body);
            let fn = this.options.endpoints;
            //? Routing
            for (const route of path) {
                fn = utils_1.FunctionUtils.getObjectPropertyIgnoreCase(fn, route);
                if (!fn)
                    return rs.status(404).end("Method " + URL + " not found.");
            }
            if (typeof fn !== "function")
                return rs.status(404).end("Method " + URL + " not found.");
            //? Executing
            const params = fn.params || utils_1.FunctionUtils.getParamNames(fn);
            const args = [];
            if (params.includes("$request"))
                body.$request = rq;
            for (const i in body)
                body[i.replace(/[^a-z0-9]/gi, '').toLowerCase()] = body[i]; //? Ignore param case
            for (const param of params) {
                try {
                    var res = JSON.parse(body[param.toLowerCase()]);
                    args.push(res);
                }
                catch (exc) {
                    args.push(body[param.toLowerCase()]);
                }
            }
            rs.header('Content-Type', 'application/json');
            try {
                var result = yield fn(...args);
                if (result === null || result === void 0 ? void 0 : result.$raw) {
                    if (result.ctype)
                        rs.header("Content-Type", result.ctype);
                    return rs.status(200).end(result.$raw);
                }
                else if (!Array.isArray(result) && (0, rxjs_1.isObservable)(result))
                    result = yield result.pipe((0, operators_1.toArray)()).toPromise();
                if (this.options.responseType === "object")
                    rs.status(200).json({ result });
                else if (this.options.responseType === "raw")
                    rs.status(200).json(result);
            }
            catch (exc) {
                (0, logger_1.log)("UNETE", (0, termx_1.danger)(rq.connection.remoteAddress), (0, termx_1.danger)(exc.message || exc));
                if (this.options.responseType === "object")
                    rs.status(500).json({ error: exc.message });
                else if (this.options.responseType === "raw")
                    rs.status(500).json(exc.message);
            }
        }));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const staticPath in this.options.static) {
                this.app.use(express.static(staticPath));
            }
            return yield new Promise((done, err) => {
                this.server.listen(this.options.port, () => {
                    (0, logger_1.log)("UNETE", "HTTP Server running at port:", (0, termx_1.highlight)(this.options.port));
                    done(null);
                });
            });
        });
    }
}
exports.HTTPServer = HTTPServer;
//# sourceMappingURL=http-proxy.js.map