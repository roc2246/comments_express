// PACKAGES
const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();


// Body parsing middleware
app.use(express.json());

// CONFIG
const port = process.env.PORT || 3000;

// DATABASE CONNECTION
async function connectToDB() {
  try {
    const url = process.env.MONGODB_URI;
    const client = new MongoClient(url);
    await client.connect();

    const db = client.db("comment_app");

    return db;
  } catch (error) {
    console.error(error);
    throw error;
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
  } catch (error) {
    console.error("Error while processing the GET request:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ROUTES - USERs
app.get("/users", async (req, res) => {
  try {
    const data = await connectToDB();
    const collection = data.collection("users");
    const documents = await collection.find({}).toArray();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(documents));
  } catch (error) {
    console.error("Error while processing the GET request:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ROUTES - ADD COMMENT
app.post("/new-comment", async (req, res) => {
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    await collection.insertOne(req.body);

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Comment added successfully" }));
  } catch (error) {
    console.error("Error while adding comment:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ROUTES - EDIT COMMENT
app.put("/edit-comment/:commentId", async (req, res) => {
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.updateOne(
      { id: parseInt(req.params.commentId) },
      { $set: req.body }
    );

    if (result.matchedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment updated successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment not found" }));
    }
  } catch (error) {
    console.error("Error while updating comment:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ROUTES - DELETES COMMENT
app.delete("/delete-comment/:commentId", async (req, res) => {
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.deleteOne({
      id: parseInt(req.params.commentId),
    });

    if (result.deletedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment deleted successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment not found" }));
    }
  } catch (error) {
    console.error("Error while deleting comment:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ROUTES - ADDS REPLY
app.post("/new-reply/:commentId", async (req, res) => {
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.updateOne(
      { id: req.params.commentId },
      { $push: { replies: req.body } }
    );

    if (result.matchedCount > 0) {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Reply added successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment not found" }));
    }
  } catch (error) {
    console.error("Error while adding comment:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ROUTES - EDITS REPLY
app.post("/edit-reply/:replyId", async (req, res) => {
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.updateOne(
      { "comments.replies.id": req.params.replyId },
      { $set: req.body }
    );

    if (result.matchedCount > 0) {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Reply edited successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment not found" }));
    }
  } catch (error) {
    console.error("Error while adding comment:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ROUTES - DELETES REPLY
app.delete("/delete-reply/:replyId", async (req, res) => {
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.updateOne(
      { "comments.replies.id": req.params.replyId },
      { $pull: { "comments.$.replies": { "id": req.params.replyId } } }
    );

    if (result.matchedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Reply deleted successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Reply not found" }));
    }
  } catch (error) {
    console.error("Error while deleting reply:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
});

// ROUTES - UPVOTE COMMENT
app.put("/upvote-comment/:commentId", async (req, res) =>{
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.updateOne(
      { "comments.id": req.params.commentId },
      { $inc: { "comments.score": 1 } }
    );

    if (result.matchedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Upvoted Successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment not found" }));
    }
  
  } catch (error) {
    console.error("Error while updating vote:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
})

// ROUTES - DOWNVOTE COMMENT
app.put("/upvote-comment/:commentId", async (req, res) =>{
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.updateOne(
      { "comments.id": req.params.commentId },
      { $inc: { "comments.score": -1 } }
    );

    if (result.matchedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Upvoted Successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Comment not found" }));
    }
  
  } catch (error) {
    console.error("Error while updating vote:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
})

// ROUTES - UPVOTE REPLY
app.put("/upvote-reply/:replyId", async (req, res) =>{
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.updateOne(
      { "comments.replies.id": req.params.replyId },
      { $inc: { "comments.replies.score": 1 } }
    );

    if (result.matchedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Upvoted Successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "reply not found" }));
    }
  
  } catch (error) {
    console.error("Error while updating vote:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
})

// ROUTES - DOWNVOTE REPLY
app.put("/downvote-reply/:replyId", async (req, res) =>{
  try {
    const data = await connectToDB();
    const collection = data.collection("comments");

    const result = await collection.updateOne(
      { "comments.replies.id": req.params.replyId },
      { $inc: { "comments.replies.score": -1 } }
    );

    if (result.matchedCount > 0) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Upvoted Successfully" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "reply not found" }));
    }
  
  } catch (error) {
    console.error("Error while updating vote:", error);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }
})

// CONNECTION
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
