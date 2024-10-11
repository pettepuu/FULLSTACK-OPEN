const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'Password is too short. Try again' });
  }

  if (await User.findOne({ username })) {
    return response.status(400).json({ error: 'You cannot use existing username' });
  }
  

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  await user
      .save()
      .then(result => {
        response.status(201).json(result);
      })
      .catch(error => {
        response.status(500).json({ error: 'Internal Server Error' });
      });
})

usersRouter.get('/', async (request, response) => {
    User
      .find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1 })
      .then(users => {
        response.json(users)
        console.log(users)
      })
  })

  usersRouter.get('/:id', async (request, response) => {
    try {
      const user = await User.findById(request.params.id).populate('blogs'); 
      if (!user) return response.status(404).json({ error: 'User not found' });
      response.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      response.status(500).json({ error: 'Server error' });
    }
  });

module.exports = usersRouter