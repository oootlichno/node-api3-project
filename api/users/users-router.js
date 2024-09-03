const express = require('express');
const {
validateUserId,
validateUser,
validatePost,
} = require('../middleware/middleware')

const Post = require("../posts/posts-model");
const User = require("./users-model");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
  .then(users => {
    res.json(users)
  })
  .catch(next)

});

router.get('/:id', validateUserId, (req, res) => {
 res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  User.insert({name: req.name})
  .then(newUser => {
    throw new Error ('oh no!')
    res.status(201).json(newUser)
  })
  .catch(err => {
    next(err)
  })
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  User.update(req.params.id, {name: req.name})
  .then(rowsChanged => {
    return User.getById(req.params.id)
  })
  .then(user => {
    res.json(user)
  })
  .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try{
   await User.remove(req.params.id)
   res.json(req.user)
  }
  catch(err){
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
const result = await User.getUserPosts(req.params.id)
res.json(result)

  }
  catch(err){
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  console.log(req.user)
  console.log(req.text)
});

router.use((err, req, res, next) => {
res.status(err.status || 500).json({
  customMessage: 'something bad happened',
  message: err.message,
  stack: err.stack,
})
})

// do not forget to export the router
module.exports = router;