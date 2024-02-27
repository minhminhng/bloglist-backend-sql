const router = require('express').Router()

const { tokenExtractor } = require('../util/middleware')
const { User, Token } = require('../models')

router.delete('/', tokenExtractor, async (req, res, next) => {
  if (req.savedToken)
  {
    try {
      req.savedToken.destroy()
      res.status(204).end()
    } 
    catch (error) {
      next(error)
    }
  }
  else {
    next(new Error('Invalid token parameter'))
  }
})

module.exports = router