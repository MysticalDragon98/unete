"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var io_1 = require("@unete/io");
var http_proxy_1 = require("./http-proxy");
var __tempServer__;
var Server = /** @class */ (function (_super) {
    __extends(Server, _super);
    function Server(options) {
        var _this = _super.call(this, options.endpoints, (__tempServer__ = new http_proxy_1.HTTPServer({
            port: options.port,
            endpoints: options.endpoints,
            responseType: "object",
            ssl: options.ssl
        })).server) || this;
        _this.options = options;
        _this.httpServer = __tempServer__;
        return _this;
    }
    Server.prototype.listen = function () {
        return this.httpServer.init();
    };
    return Server;
}(io_1.Server));
exports.Server = Server;
//# sourceMappingURL=index.js.map