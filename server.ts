import express from "express";
import { createServer } from "http";
import next from "next";
import { Server as SocketServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const expressApp = express();

  expressApp.get("/secret", (req, res) => {
    const key = req.query.key;

    if (!key || typeof key !== "string") {
      return res
        .status(400)
        .json({ error: "Key is required and should be a string" });
    }

    const redirectUrl = `http://localhost:3000/?api=true&key=${key}`;
    res.redirect(redirectUrl);
  });

  // Handle all other routes
  expressApp.all("*", (req, res) => {
    return handle(req, res);
  });

  const server = createServer(expressApp);

  const io = new SocketServer(server);

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  server.listen(port, (err?: Error) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
