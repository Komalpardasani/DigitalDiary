//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Reading Enviroment Variables
dotenv.config();

const main_StartingContent = "Welcome to Digital Diary, where your journey through the fascinating world of technology begins! ";
const aboutContent = "Welcome to Digital Diary, your go-to destination for all things tech and coding! At Digital Diary, we are passionate about sharing insightful, informative, and engaging content that covers the latest trends, tips, and tutorials in web development, machine learning, and beyond. Our mission is to empower developers and tech enthusiasts of all skill levels by providing valuable resources and fostering a community of innovation and learning. Whether you’re a seasoned programmer or just starting your coding journey, Digital Diary is here to inspire, educate, and support you every step of the way. Dive into our articles, join the conversation, and let's embark on this digital adventure together!";
const contactContent = "We'd love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to get in touch with us at Digital Diary. You can reach us through komalpardasani40@gmail.com";

//start express application
const app = express();

//render template files using the view engine
app.set('view engine', 'ejs');

//Setting up our static path and Body Parser
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Connect to local MongoDB "mongodb://localhost:27017/blogDB" or Connect to Your MongoDb Atlas Connection
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//creating postSchema
const postSchema = {
  title: String,
  content: String
};

//Creating new MongooseModel to define Post collection
const Post = mongoose.model("Post", postSchema);

//Setting up Home Route
app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      starting_Content: main_StartingContent,
      posts: posts
    });
  });
});

//Setting up about route + render about.ejs
app.get("/about", function(req, res) {
  res.render("about", {
    about_Content: aboutContent
  });
});

//Setting up Contact Route + render contact.ejs
app.get("/contact", function(req, res) {
  res.render("contact", {
    contact_Content: contactContent
  });
});

//Setting up Compose Route + render compose.ejs
app.get("/compose", function(req, res) {
  res.render("compose");
});

//Grab the data they send to us, redirict to home route
app.post("/compose", function(req, res) {
  const post_Title = req.body.post_Title;
  const post_Body = req.body.post_Body;

  const post = new Post({
    title: post_Title,
    content: post_Body
  });

  post.save().then(res.redirect("/"));
});

//Setting Up dynamic URL
app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  Post.findById({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

//Setting up the Delete Route + remove posts
app.post("/delete", function(req, res) {
  const deletePost = req.body.deletePost;
  Post.findOneAndRemove({
    title: deletePost
  }).then(res.redirect("/"));
});

//------------------ Listen on Port 3000 ---------------------------------------
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

//set up express server
app.listen(port, function() {
  console.log("Server started successfully on " + port);
});
