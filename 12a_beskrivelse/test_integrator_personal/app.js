const PORT = 8080;

const express = require('express');
const app = express();

app.use(express.json());

app.post('/receive', (req, res) => {
    console.log(req.body);
    console.log("message received");
});


app.listen(PORT, () => {
    console.log('Server is running on port '+ PORT);
})