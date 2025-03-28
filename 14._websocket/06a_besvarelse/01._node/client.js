import { WebSocket } from "ws";

const websocketclient = new WebSocket("ws://localhost:8080");

websocketclient.on("open", () => {
    websocketclient.send("sending a client message from node.js!");

    websocketclient.on("message", (message) => {
        console.log("received message from server: "+ message);

    
    })
});