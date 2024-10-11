require('dotenv').config();
const tokenExtractor = require('./middleware/tokenExtractor')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.errors });
  }
  next(err);
});

mongoose.set('strictQuery', false);

app.use(tokenExtractor);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

const dburl = process.env.MONGODB_URI;
console.log(process.env.MONGODB_URI)

console.log('connecting to', dburl);
mongoose.connect(dburl)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error);
  });

  


module.exports = app;