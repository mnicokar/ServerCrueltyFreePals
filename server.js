const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
//test
const cors = require('cors');
app.use(cors());

const url = 'mongodb+srv://nicokarmobin:6nlol4V6XXnO1NxM@crueltyfreepals.jw3bkwc.mongodb.net/?retryWrites=true&w=majority&appName=CrueltyFreePals';
const dbName = 'mydatabase';

let db, collection;

async function connectToMongoDB() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB');
  db = client.db(dbName);
  collection = db.collection('mycollection');
}

app.use(express.json());

// Endpoint to search for documents by "line" field
app.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).send('Query parameter is required');
  }

  try {
    const results = await collection.find({ line: { $regex: query, $options: 'i' } }).toArray();
    res.json(results);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server and connect to MongoDB
app.listen(port, async () => {
  await connectToMongoDB();
  console.log(`Server is running on http://localhost:${port}`);
});