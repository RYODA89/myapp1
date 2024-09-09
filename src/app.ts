import express, { NextFunction, Response } from "express";
const cors = require("cors");
const compression = require("compression");
const path = require("path");
// constantes
const PORT = 3024;
const IP = require("ip").address();
// =================================== APP CONFIG =========================================================
const app = express();
const httpServer = require("http").createServer(app);
const htmlPath = path.resolve('./', 'front/build')
console.log(":fusée: ~ htmlPath:", htmlPath)
// =================================== MIDDLEWARES =========================================================
app.use(express.urlencoded({ limit: '50mb', extended: true, }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({ credentials: true, optionsSuccessStatus: 200, origin: true }));
app.use(compression());
// ============================== SOCKET.IO CONFIGURATION ==============================================
const options = {
    transports: ["websocket"],
    pingTimeout: 2500,
    pingInterval: 5000,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
};
const io = require("socket.io")(httpServer, options);
const ioMiddleware = (req: any, res: Response, next: NextFunction) => {
    req.io = io;
    next();
};
app.use(ioMiddleware);
const cnxInfos = { ip: IP, port: PORT };

app.get("/test", (req, res, next) => {
    res.send("Hello world");
})
app.use('/', express.static(htmlPath));
app.get("/*", function (req, res) {
    res.sendFile(`${htmlPath}/index.html`);
});
//Lancement du server
const welcomeMsg = `
    ============================
    SPIDER-LOCAL-SERVER v 
    Port: ${PORT}
    Ip: ${IP}
    Start: ${new Date().toLocaleString("fr-FR")}
    Working Dir: ${process.cwd()}
    Database mode:
    ============================
`;
httpServer.listen(PORT, () => {
    console.log((welcomeMsg));
});