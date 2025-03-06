import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send({data: "2nd server"});
});

const PORT = 3000
app.listen(PORT, () => {
    console.log('Server is running on port '+ PORT);
})
