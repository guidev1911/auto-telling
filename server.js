const app = require('./app');
const http = require('http'); 
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

io.on("connection", (socket) => {
    console.log("Novo usuário conectado ao WebSocket");

    socket.on("disconnect", () => {
        console.log("Usuário desconectado");
    });
});

app.set("io", io);

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
