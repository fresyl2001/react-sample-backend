const express = require('express');
const bodyParser = require('body-parser');
const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.get('/posts', async (req, res) => {
	const storedPosts = await getStoredPosts();
	res.json({ posts: storedPosts });
});

app.post('/posts', async (req, res) => {
	const existingPosts = await getStoredPosts();
	const newPost = { ...req.body, id: Math.random().toString() };
	await storePosts([newPost, ...existingPosts]);
	res.status(201).json({ message: 'Stored new post.', post: newPost });
});

app.put('/posts/:id', async (req, res) => {
	const storedPosts = await getStoredPosts();
	const updatedPosts = storedPosts.map(post => post.id === req.params.id ? { ...post, ...req.body } : post);
	await storePosts(updatedPosts);
	res.json({ message: 'Post updated!', post: req.body });
});

app.delete('/posts/:id', async (req, res) => {
	const storedPosts = await getStoredPosts();
	const updatedPosts = storedPosts.filter(post => post.id !== req.params.id);
	await storePosts(updatedPosts);
	res.json({ message: 'Post deleted!' });
});

app.listen(8080);
