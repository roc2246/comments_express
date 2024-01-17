const express = require('express')
const app = express()
const port = 3000

require('dotenv').config()

// Set up middleware for static files (CSS, JS, images, etc.)
app.use(express.static("views"));

// Sets up route for home page
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// DISPLAYS COMMENTS AND REPLIES
app.get("/comments", (req, res) => {
  const json = {
    test: "test"
  }
  res.send(json)
})

// ADDS COMMENT
// EDITS COMMENT
// DELETES COMMENT
// ADDS REPLY
// EDITS REPLY
// DELETES REPLY

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})