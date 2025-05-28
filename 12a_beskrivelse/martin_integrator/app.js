// integreret med martin: https://github.com/Martin-Niemann/KEA_System_Integration/blob/main/12a/README.md

// ngrok http 8080 i anden terminal
// nodemon app.js i denne
import express from 'express';

const url = "http://91.101.69.70:13463";
const PORT = 8080;

const NGROK_URL = "https://737a-83-92-88-92.ngrok-free.app"; // DENNE SKAL ÆNDRES HVER GANG ngrok http 8080 KØRES

const app = express();
app.use(express.json());

app.post('/webhooks/', (req, res) => {
    console.log("Webhook received:", req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    start();
});

const start = () => {
    fetch(url + "/newtoken", { method: "GET" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Token fetch failed: ${response.status}`);
            }
            return response.json();
        })
        .then(async data => {
            const token = data.token;
            console.log("Token:", token);

            const webhookUrl = `${NGROK_URL}/webhooks/`;
            console.log("Registering webhook with URL:", webhookUrl);

            const events = [
                "payment_processed",
                "order_processed",
                "order_shipped",
                "receipt_delivered"
            ];

            for (const event of events) {
                await register(token, event, webhookUrl);
                console.log(`Registered for event: ${event}`);
            }

            console.log("All events registered successfully.");
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
};

const register = (token, event, webhookUrl) => {
    return fetch(url + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, url: webhookUrl, token }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Register failed: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error(`Fetch error registering event "${event}":`, error);
        throw error; 
    });
};