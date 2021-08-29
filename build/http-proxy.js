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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServer = void 0;
var express = require('express');
var bodyParser = require('body-parser');
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var fs_1 = require("fs");
var path_1 = require("path");
var termx_1 = require("termx");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var url_1 = require("url");
var logger_1 = require("@mysticaldragon/logger");
var utils_1 = require("@mysticaldragon/utils");
var HTTPServer = /** @class */ (function () {
    function HTTPServer(options) {
        var _this = this;
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
            verify: function (req, res, buf) {
                req.rawBody = buf;
            }
        }));
        this.app.use(function (rq, rs) { return __awaiter(_this, void 0, void 0, function () {
            var url, method, URL, path, body, fn, _i, path_2, route, params, args, i, _a, params_1, param, res, result, exc_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = rq.url, method = rq.method;
                        URL = (0, url_1.parse)(url).pathname;
                        path = (URL === null || URL === void 0 ? void 0 : URL.split('/').slice(1)) || [];
                        body = method === "GET" ? rq.query : rq.body;
                        (0, logger_1.log)("UNETE", "(" + (0, termx_1.danger)(rq.connection.remoteAddress) + ") " + (0, termx_1.highlight)(method) + " - " + URL, body);
                        fn = this.options.endpoints;
                        //? Routing
                        for (_i = 0, path_2 = path; _i < path_2.length; _i++) {
                            route = path_2[_i];
                            fn = utils_1.FunctionUtils.getObjectPropertyIgnoreCase(fn, route);
                            if (!fn)
                                return [2 /*return*/, rs.status(404).end("Method " + URL + " not found.")];
                        }
                        if (typeof fn !== "function")
                            return [2 /*return*/, rs.status(404).end("Method " + URL + " not found.")];
                        params = fn.params || utils_1.FunctionUtils.getParamNames(fn);
                        args = [];
                        if (params.includes("$request"))
                            body.$request = rq;
                        for (i in body)
                            body[i.replace(/[^a-z0-9]/gi, '').toLowerCase()] = body[i]; //? Ignore param case
                        for (_a = 0, params_1 = params; _a < params_1.length; _a++) {
                            param = params_1[_a];
                            try {
                                res = JSON.parse(body[param.toLowerCase()]);
                                args.push(res);
                            }
                            catch (exc) {
                                args.push(body[param.toLowerCase()]);
                            }
                        }
                        rs.header('Content-Type', 'application/json');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, fn.apply(void 0, args)];
                    case 2:
                        result = _b.sent();
                        if (!(result === null || result === void 0 ? void 0 : result.$raw)) return [3 /*break*/, 3];
                        if (result.ctype)
                            rs.header("Content-Type", result.ctype);
                        return [2 /*return*/, rs.status(200).end(result.$raw)];
                    case 3:
                        if (!(!Array.isArray(result) && (0, rxjs_1.isObservable)(result))) return [3 /*break*/, 5];
                        return [4 /*yield*/, result.pipe((0, operators_1.toArray)()).toPromise()];
                    case 4:
                        result = _b.sent();
                        _b.label = 5;
                    case 5:
                        if (this.options.responseType === "object")
                            rs.status(200).json({ result: result });
                        else if (this.options.responseType === "raw")
                            rs.status(200).json(result);
                        return [3 /*break*/, 7];
                    case 6:
                        exc_1 = _b.sent();
                        (0, logger_1.log)("UNETE", (0, termx_1.danger)(rq.connection.remoteAddress), (0, termx_1.danger)(exc_1.message || exc_1));
                        if (this.options.responseType === "object")
                            rs.status(500).json({ message: exc_1.message });
                        else if (this.options.responseType === "raw")
                            rs.status(500).json(exc_1.message);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    }
    HTTPServer.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var staticPath;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        for (staticPath in this.options.static) {
                            this.app.use(express.static(staticPath));
                        }
                        return [4 /*yield*/, new Promise(function (done, err) {
                                _this.server.listen(_this.options.port, function () {
                                    (0, logger_1.log)("UNETE", "HTTP Server running at port:", (0, termx_1.highlight)(_this.options.port));
                                    done(null);
                                });
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return HTTPServer;
}());
exports.HTTPServer = HTTPServer;
//# sourceMappingURL=http-proxy.js.map