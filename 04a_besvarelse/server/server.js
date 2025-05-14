const express = require('express');
const app = express();

app.get('/timesync', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream'); // data type er event stream
    res.setHeader('Cache-Control', 'no-cache'); // ingen grund til at cache da der kommer ny data
    res.setHeader('Connection', 'keep-alive'); // hold forbindelsen åben

    const interval = setInterval(() => {
        res.write('data: ' + new Date().toISOString() + '\n\n'); // dette har ALTID formatet "data: " + *indsæt data her* + "\n\n"
    }, 1000);

    req.on('close', () => {
        clearInterval(interval);
    });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}/timesync`);
});