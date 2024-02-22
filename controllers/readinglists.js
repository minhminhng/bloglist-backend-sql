const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')

const { tokenExtractor } = require('../util/middleware')

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

router.put('/:id', tokenExtractor, async (req, res, next) => {
  if (req.decodedToken.id) {
    try {    
      const readinglist = await ReadingList.findByPk(req.params.id)
      console.log(req.decodedToken.id)
      console.log(readinglist.userId)
      if (readinglist && req.decodedToken.id === readinglist.userId) {
        if (req.body.read) {
          readinglist.read = req.body.read
          await readinglist.save()
          res.json(readinglist)
        }
      }
      else if(!readinglist) {
        next(new Error('Invalid reading list id'))
      }
      else {
        next(new Error('Reading list does not belong to this user'))
      }
    } 
    catch (error) {
      next(error)
    }
  }  
})

module.exports = router