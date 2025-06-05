// my example has people and their favorite songs, migrating from MySql to mongo
import Database from 'better-sqlite3';
import { MongoClient } from 'mongodb';

const sqliteFile = './migrationDB.sqlite';
const mongoUri = 'mongodb://localhost:27017';
const mongoDbName = 'migrationMongo';

async function migrate() {
  // Open SQLite DB
  const sqliteDb = new Database(sqliteFile, { readonly: true });

  // Connect Mongo
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const mongoDb = mongoClient.db(mongoDbName);
  const peopleCollection = mongoDb.collection('people');

  console.log('Fetching data from SQLite...');

 
  const rows = sqliteDb.prepare(`
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
  `).all();

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

  const documents = Array.from(grouped.values());

  console.log(`Inserting ${documents.length} people into MongoDB...`);
  await peopleCollection.insertMany(documents);
  console.log('Migration complete.');

  await mongoClient.close();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
});