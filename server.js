const express = require("express");
const path = require('path');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors());

io.on("connection", (socket) => socket.on("__baeg-endeu_hochul", async (head, body, callback) => await fetch(
	path.join("http://localhost:8000", head.route), {
		method: head.method ?? "POST",
		[(head.method !== "GET") && 'headers'] : {'Content-Type': 'application/json'},
		[(head.method !== "GET") && 'body']: JSON.stringify(body)
	})
	.then((r) => r.text())
	.then((r) => {
		console.log(r);
		return JSON.parse(r);
	})
	.then((r) => callback(r))
));

app.use(express.static(path.resolve(__dirname, 'client_v2/dist')));
app.use('*', (req, res, next) => res.sendFile(path.join(__dirname, 'client_v2/dist')));

server.listen(80, () => {});