// in my example i have a mysql db with a person table and a favorite_songs and songs table

import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'migrationDB',
};

const mongoUri = 'mongodb://localhost:27017';
const mongoDbName = 'migrationMongo';

async function migrate() {
  const mysqlConn = await mysql.createConnection(mysqlConfig);
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const mongoDb = mongoClient.db(mongoDbName);
  const peopleCollection = mongoDb.collection('people');

  console.log('Fetching data from MySQL...');

  const [rows] = await mysqlConn.execute(`
    SELECT 
      p.id as person_id,
      p.name,
      p.email,
      s.title,
      s.artist,
      s.album
    FROM person p
    JOIN favorite_songs fs ON p.id = fs.person_id
    JOIN songs s ON fs.song_id = s.id
    ORDER BY p.id
  `);

  // Group by person_id
  const grouped = new Map();
  for (const row of rows) {
    const personId = row.person_id;
    if (!grouped.has(personId)) {
      grouped.set(personId, {
        name: row.name,
        email: row.email,
        favoriteSongs: [],
      });
    }
    grouped.get(personId).favoriteSongs.push({
      title: row.title,
      artist: row.artist,
      album: row.album,
    });
  }

  // Insert into MongoDB
  const documents = Array.from(grouped.values());

  console.log(`Inserting ${documents.length} people into MongoDB...`);
  await peopleCollection.insertMany(documents);
  console.log('Migration complete.');

  await mysqlConn.end();
  await mongoClient.close();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
});