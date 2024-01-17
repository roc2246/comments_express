// PACKAGES
const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

// CONFIG
const port = process.env.PORT || 3000;

// DATABASE CONNECTION
async function connectToDB() {
  try {
    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db("comments");

    return db; 
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// ROUTES

// ROUTES - VIEWS
app.use(express.static("views"));

// ROUTES - HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// ROUTES - COMMENTS
app.get("/comments", async (req, res) => {
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");
    const documents = await collection.find({}).toArray();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(documents));
  } catch (err) {
    console.error("Error while processing the GET request:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ADDS COMMENT
// EDITS COMMENT
// DELETES COMMENT
// ADDS REPLY
// EDITS REPLY
// DELETES REPLY

// CONNECTION
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
