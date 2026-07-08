const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Comment = require("./models/comments");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect("mongodb://127.0.0.1:27017/comments")
  .then(() => {
    console.log("✅ Database Connected Successfully!");
  })
  .catch((err) => {
    console.log("❌ Database Connection Failed");
    console.log(err);
  });

app.get("/", (req, res) => {
  res.render("dash");
});

app.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.render("index", { comments });
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to fetch comments.");
  }
});

app.get("/comments/new", (req, res) => {
  res.render("new");
});

app.post("/comments", async (req, res) => {
  try {
    const { user, text } = req.body;
    await Comment.create({
      user,
      text,
      likes: 0,
      dislikes: 0
    });
    res.redirect("/comments");
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to create comment.");
  }
});

app.get("/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).render("404");
    }
    res.render("show", { comment });
  } catch (err) {
    console.log(err);
    res.status(500).render("404");
  }
});

app.get("/comments/:id/edit", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).render("404");
    }
    res.render("edit", { comment });
  } catch (err) {
    console.log(err);
    res.status(500).render("404");
  }
});

// ======================
// Update Comment
// ======================
app.patch("/comments/:id", async (req, res) => {
  try {
    const { user, text, likes } = req.body;
    await Comment.findByIdAndUpdate(req.params.id, {
      user,
      text,
      likes: parseInt(likes) || 0
    });
    res.redirect(`/comments/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to update comment.");
  }
});

// ======================
// Like Comment
// ======================
app.patch("/comments/:id/like", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      if (req.xhr || (req.headers.accept && req.headers.accept.includes("json"))) {
        return res.status(404).json({ error: "Comment not found" });
      }
      return res.status(404).render("404");
    }

    comment.likes++;
    if (comment.dislikes > 0) {
      comment.dislikes--;
    }

    await comment.save();

    if (req.xhr || (req.headers.accept && req.headers.accept.includes("json"))) {
      return res.json({ likes: comment.likes, dislikes: comment.dislikes });
    }
    res.redirect(req.get("Referrer") || `/comments/${req.params.id}`);
  } catch (err) {
    console.log(err);
    if (req.xhr || (req.headers.accept && req.headers.accept.includes("json"))) {
      return res.status(500).json({ error: "Unable to like comment." });
    }
    res.status(500).send("Unable to like comment.");
  }
});

// ======================
// Dislike Comment
// ======================
app.patch("/comments/:id/dislike", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      if (req.xhr || (req.headers.accept && req.headers.accept.includes("json"))) {
        return res.status(404).json({ error: "Comment not found" });
      }
      return res.status(404).render("404");
    }

    comment.dislikes++;
    if (comment.likes > 0) {
      comment.likes--;
    }

    await comment.save();

    if (req.xhr || (req.headers.accept && req.headers.accept.includes("json"))) {
      return res.json({ likes: comment.likes, dislikes: comment.dislikes });
    }
    res.redirect(req.get("Referrer") || `/comments/${req.params.id}`);
  } catch (err) {
    console.log(err);
    if (req.xhr || (req.headers.accept && req.headers.accept.includes("json"))) {
      return res.status(500).json({ error: "Unable to dislike comment." });
    }
    res.status(500).send("Unable to dislike comment.");
  }
});

// ======================
// Delete Comment
// ======================
app.delete("/comments/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.redirect("/comments");
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to delete comment.");
  }
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(4400, () => {
  console.log("🚀 Server running at http://localhost:4400");
});