const blogRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')

blogRouter.get('/', (request, response) => {
    Blog
      .find({}).populate('user', {username: 1, name: 1, id: 1}) 
      .then(blogs => {
        response.json(blogs)
        console.log(blogs)
      })
  })

  blogRouter.put('/:id', async (request, response) => {
    const { id } = request.params;
    const updatedBlog = request.body;

    const result = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });

    if (result) {
        response.status(200).json(result);
    } else {
        response.status(404).end();
    }
});

blogRouter.delete('/:id', async (request, response) => {
  const token = request.token;
  console.log('Token received for deletion:', token);
  const blogId = request.params.id;

  try {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (!decodedToken.id) {
          return response.status(401).json({ error: 'Token invalid' });
      }

      const user = await User.findById(decodedToken.id);
      if (!user) {
          return response.status(404).json({ error: 'User not found' });
      }

      const blog = await Blog.findById(blogId);
      if (!blog) {
          return response.status(404).json({ error: 'Blog not found' });
      }

      if (blog.user.toString() !== user._id.toString()) {
          return response.status(403).json({ error: 'Unauthorized to delete this blog' });
      }

      await Blog.findByIdAndDelete(blogId);

      // Check if user.blogs is defined and is an array
      if (Array.isArray(user.blogs)) {
          // Remove the blog ID from the user's blog array
          user.blogs = user.blogs.filter(b => b.toString() !== blogId.toString());
          await user.save();
      } else {
          console.error('user.blogs is not defined or not an array:', user.blogs);
      }

      return response.status(204).end(); // No content to send back after deletion
  } catch (error) {
      if (error.name === 'TokenExpiredError') {
          console.error('Token has expired:', error);
          return response.status(401).json({ error: 'Token has expired. Please refresh the token.' });
      }

      console.error('Error verifying token:', error);
      return response.status(401).json({ error: 'Token verification failed' });
  }
});



  blogRouter.post('/', async (request, response) => {
    const body = request.body;
    const token = request.token;
    
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
  
    console.log('User found:', user);
  
    if (body.title === "" || body.url === "") {
      return response.status(400).json({ error: 'Title and URL are required' });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    });
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog)
  });

  module.exports = blogRouter