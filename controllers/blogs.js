const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { blogFinder, tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    const search = '%' + req.query.search.toLowerCase() + '%'
    where = { 
      [Op.or]: [
        {
          title: {
            [Op.iLike]: search
          }
        },
        {
          author: {
            [Op.iLike]: search
          }
        }
      ] 
    }
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
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