import Database from 'better-sqlite3';

const db = new Database('migrationDB.sqlite');

db.exec(`
  CREATE TABLE IF NOT EXISTS person (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS favorite_songs (
    id INTEGER PRIMARY KEY,
    person_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    FOREIGN KEY (person_id) REFERENCES person(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
  );
`);

// Insert people
const insertPerson = db.prepare('INSERT INTO person (id, name, email) VALUES (?, ?, ?)');
insertPerson.run(1, 'Alice', 'alice@example.com');
insertPerson.run(2, 'Bob', 'bob@example.com');

// Insert songs
const insertSong = db.prepare('INSERT INTO songs (id, title, artist, album) VALUES (?, ?, ?, ?)');
insertSong.run(1, 'Song A', 'Artist A', 'Album A');
insertSong.run(2, 'Song B', 'Artist B', 'Album B');
insertSong.run(3, 'Song C', 'Artist C', 'Album C');

// Insert favorite songs
const insertFav = db.prepare('INSERT INTO favorite_songs (person_id, song_id) VALUES (?, ?)');
insertFav.run(1, 1);  // Alice likes Song A
insertFav.run(1, 3);  // Alice likes Song C
insertFav.run(2, 2);  // Bob likes Song B

console.log('SQLite database populated!');
db.close();