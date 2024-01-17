const express = require('express')
const app = express()
const port = 3000

// Set up middleware for static files (CSS, JS, images, etc.)
app.use(express.static("views"));

// Sets up route for home page
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})