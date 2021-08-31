"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const io_1 = require("@unete/io");
const http_proxy_1 = require("./http-proxy");
let __tempServer__;
class Server extends io_1.Server {
    constructor(options) {
        super(options.endpoints, (__tempServer__ = new http_proxy_1.HTTPServer({
            port: options.port,
            endpoints: options.endpoints,
            responseType: "object",
            ssl: options.ssl
        })).server);
        this.options = options;
        this.httpServer = __tempServer__;
    }
    listen() {
        return this.httpServer.init();
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map