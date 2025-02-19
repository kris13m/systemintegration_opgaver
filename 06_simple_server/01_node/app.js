import express from 'express';

const app = express();

app.get('/greetings', (req, res) => {
    res.send({greeting: ["hello", "hi", "howdy", "greetings"]});
});


const PORT = 3000
app.listen(PORT, () => {
    console.log('Server is running on port '+ PORT);
})
