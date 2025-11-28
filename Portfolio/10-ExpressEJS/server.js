const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public"))); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

let currentUser = null;
let posts = [];

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/login", (req, res) => {
    const { name } = req.query;
    currentUser = name;
    res.send(`Hello ${name}! (GET - NOT SECURE)`);
});

app.post("/login", (req, res) => {
    const { name } = req.body;
    currentUser = name;
    res.render("test", { name: currentUser });
});


app.get("/home", (req, res) => {
    if (!currentUser) {
        return res.redirect("/");
    }

    res.render("home", {
        name: currentUser,
        posts: posts
    });
});


app.post("/add-post", (req, res) => {
    const { title, content } = req.body;

    posts.push({
        id: Date.now(),
        title,
        content
    });

    res.redirect("/home");
});


app.get("/post/:id", (req, res) => {
    if (!currentUser) return res.redirect("/");

    const post = posts.find(p => p.id == req.params.id);
    if (!post) return res.send("Post not found");

    res.render("post", { post });
});


app.post("/post/:id/edit", (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    post.content = req.body.content;
    res.redirect("/home");
});

app.post("/post/:id/delete", (req, res) => {
    posts = posts.filter(p => p.id != req.params.id);
    res.redirect("/home");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
