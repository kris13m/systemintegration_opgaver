// KØRER PÅ http://localhost:3000
// /JSON FOR AT LÆSE FRA EGEN DATA(LIBARAY)
// /CLIENT FOR AT LAVE HTTP REQUEST TIL PY SERVER(CARS)

import express from 'express';
import fs from 'fs';
import axios from 'axios';

export const createServer = () => {
  const app = express();
  const port = 3000;

  app.use(express.json());

  app.get('/json', (req, res) => {
      const data = JSON.parse(fs.readFileSync("./Library/library.json", 'utf-8'));
      res.json(data);
  });

  app.get('/client', async (req, res) => {
      try {
          // Attempt to fetch data from the other server
          const response = await axios.get('http://localhost:8000/json');
          res.json(response.data);
      } catch (error) {
          // Handle any errors from the request (e.g., server is down)
          console.error('Error fetching from localhost:8000/json:', error);
          res.status(500).json({ error: 'Error fetching data from client server' });
      }
  });

  const server = app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}/`);
  });

  return { app, server };
};