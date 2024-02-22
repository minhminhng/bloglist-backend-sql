const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User, ReadingList } = require('../models')

router.post('/', async (req, res, next) => {
  try {    
    const blog = await Blog.findByPk(req.body.blogId)
    const user = await User.findByPk(req.body.userId)
    if (blog && user) {
      try {
        const readinglist = await ReadingList.create(req.body)
        res.json(readinglist)
      } 
      catch (error) {
        next(error)
      }
    }
    else {
      next(new Error('Invalid value'))
    }
  } 
  catch (error) {
    next(error)
  }
})

module.exports = router