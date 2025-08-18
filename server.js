import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import connectDB from "./src/db/db.js";
import initSocketServer from "./src/sockets/socket.server.js"
import httpServer from "http";


connectDB();

const server = httpServer.createServer(app);
initSocketServer(server);

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});