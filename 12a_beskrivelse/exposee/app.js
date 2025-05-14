
// npx ngrok http 3000 in new terminal
// nodemon app.js

import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

//event types =  ['order_received', 'order_processed', 'order_shipped'];

const app = express();
app.use(express.json());

// Open SQLite connection
const dbPromise = open({
  filename: './mydb.sqlite',
  driver: sqlite3.Database
});

// Create a users table if it doesn't exist
(async () => {
  const db = await dbPromise;
  await db.exec(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    event_type TEXT NOT NULL
  )`);
})();

app.get("/" , (req, res) =>{
  res.send("Hello world");
})

// POST endpoint to insert a user
app.post('/register', async (req, res) => {
  const { url, event_type } = req.body;

  if (!url || !event_type) {
    return res.status(400).json({ error: 'Missing url or event_type' });
  }
  if(event_type != "order_received" && event_type != "order_processed" && event_type != "order_shipped"){
    return res.status(400).json({ error: 'invalid event type' });
  }

  try {
    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO events (url, event_type) VALUES (?, ?)',
      [url, event_type]
    );
    res.status(201).json({ id: result.lastID, url, event_type });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/unregister', async (req, res) => {
  const { url, event_type } = req.body;

  if (!url || !event_type) {
    return res.status(400).json({ error: 'Missing url or event_type' });
  }

  try {
    const db = await dbPromise;
    await db.run(
      'DELETE FROM events WHERE url = ? AND event_type = ?',
      [url, event_type]
    );
    res.status(200).json({ message: 'Unregistered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  })

app.get('/ping', async (req, res) => {
  emitAllEvents();
  res.sendStatus(200);
})


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


async function emitAllEvents(){

  const db = await dbPromise;
    const subscribers = await db.all(
      'SELECT * FROM events'
    );

    const time = new Date();
    console.log(subscribers.length);

  await Promise.allSettled(
      subscribers.map(sub =>
        fetch(sub.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event_type: sub.event_type, time: time })
        })
      
      )
    );
} 
