import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors({
  origin: '*' 
}));

app.get('/timesync', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream'); 
    res.setHeader('Cache-Control', 'no-cache'); // caching ikke nødvendigt
    res.setHeader('Connection', 'keep-alive'); // hold forbindelsen i live

    const interval = setInterval(() => {
        res.write(`data: ${new Date().toISOString()}\n\n`); // SSE data har ALTID dette format
    }, 1000);

    req.on('close', () => clearInterval(interval));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});