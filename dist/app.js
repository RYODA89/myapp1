"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors = require("cors");
var compression = require("compression");
var path = require("path");
// constantes
var PORT = 3024;
var IP = require("ip").address();
// =================================== APP CONFIG =========================================================
var app = (0, express_1.default)();
var httpServer = require("http").createServer(app);
var htmlPath = path.resolve('./', 'front/build');
console.log(":fusée: ~ htmlPath:", htmlPath);
// =================================== MIDDLEWARES =========================================================
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true, }));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(cors({ credentials: true, optionsSuccessStatus: 200, origin: true }));
app.use(compression());
// ============================== SOCKET.IO CONFIGURATION ==============================================
var options = {
    transports: ["websocket"],
    pingTimeout: 2500,
    pingInterval: 5000,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
};
var io = require("socket.io")(httpServer, options);
var ioMiddleware = function (req, res, next) {
    req.io = io;
    next();
};
app.use(ioMiddleware);
var cnxInfos = { ip: IP, port: PORT };
app.get("/test", function (req, res, next) {
    res.send("Hello world");
});
app.use('/', express_1.default.static(htmlPath));
app.get("/*", function (req, res) {
    res.sendFile("".concat(htmlPath, "/index.html"));
});
//Lancement du server
var welcomeMsg = "\n    ============================\n    SPIDER-LOCAL-SERVER v \n    Port: ".concat(PORT, "\n    Ip: ").concat(IP, "\n    Start: ").concat(new Date().toLocaleString("fr-FR"), "\n    Working Dir: ").concat(process.cwd(), "\n    Database mode:\n    ============================\n");
httpServer.listen(PORT, function () {
    console.log((welcomeMsg));
});
//# sourceMappingURL=app.js.map