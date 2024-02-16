const router = require('express').Router()
const { Blog, User } = require('../models')
const { blogFinder, userFinder, tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    console.log(user)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } 
  catch (error) {
    next(error)
  }
})

router.put('/:id', blogFinder, async (req, res, next) => {
  const { author, title, url, likes }= req.body
  if (req.blog) {
    if (author) {
      req.blog.author = req.body.author
    }
    if (title) {
      req.blog.title = req.body.title
    }
    if (url) {
      req.blog.url = req.body.url
    }
    if (likes) {
      req.blog.likes = req.body.likes
    }
    await req.blog.save()
    res.json(req.blog)
  } else {
    next(new Error('blog does not exist' ))
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res, next) => {
  if (req.blog && req.decodedToken.id === req.blog.userId) {
    await req.blog.destroy()
    res.status(204).end()
  }
  else {
    next(new Error('Unauthorized user' ))
  }
})

module.exports = router