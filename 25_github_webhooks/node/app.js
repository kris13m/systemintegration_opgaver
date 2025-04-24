import express from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/githubwebhooksjson", (req, res) => {
    console.log(req.body);
    res.sendStatus(204);
});

app.post("/githubwebhooksform", (req, res) => {
    console.log(req.body);
    res.sendStatus(204);
});

const port = process.env.port || 8080;
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/`);
});