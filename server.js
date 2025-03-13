require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

// CORS Configuration
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

// Connect to MongoDB
async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('✅ MongoDB Connected');
	} catch (err) {
		console.error('❌ DB Connection Error:', err);
		process.exit(1); // Exit process if connection fails
	}
}
connectDB();

// Schema & Model for Posts
const postSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const Post = mongoose.model('Post', postSchema);

// Routes
app.get('/posts', async (req, res) => {
	try {
		const posts = await Post.find();
		res.json({ posts });
	} catch (error) {
		res.status(500).json({ message: 'Error fetching posts', error });
	}
});

app.post('/posts', async (req, res) => {
	try {
		const newPost = new Post(req.body);
		await newPost.save();
		res.status(201).json({ message: 'Stored new post.', post: newPost });
	} catch (error) {
		res.status(500).json({ message: 'Error saving post', error });
	}
});

app.put('/posts/:id', async (req, res) => {
	try {
		const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
		res.json({ message: 'Post updated!', post: updatedPost });
	} catch (error) {
		res.status(500).json({ message: 'Error updating post', error });
	}
});

app.delete('/posts/:id', async (req, res) => {
	try {
		const deletedPost = await Post.findByIdAndDelete(req.params.id);
		if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
		res.json({ message: 'Post deleted!' });
	} catch (error) {
		res.status(500).json({ message: 'Error deleting post', error });
	}
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
