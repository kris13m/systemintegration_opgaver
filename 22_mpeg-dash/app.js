import express from 'express';

const app = express();

const port = process.env.port || 8080;

app.use(express.static('public'));
app.use(express.static('videos'));

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});