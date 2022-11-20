const express = require('express')
const app = express()
const path = require('path')
app.use(express.static(
    path.join(__dirname, '../client/build')
))

app.get("/api", (req, res) => {
    console.log('/api called!!')
    res.json({"users": ["user1, user2, user3"]})
})

app.get("/", function(request, response) {
    console.log('/ called!!')
    response.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.listen(5000, ()=> {console.log("Server started on port 5000")})