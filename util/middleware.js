const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { Blog, User, Token } = require('../models')

const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: [error.message.replace('Validation error: ', '')] })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const blogFinder = async(req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const userFinder = async(req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } })
  next()
}

const tokenExtractor = async(req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const tokenString = authorization.substring(7)
      const token = await Token.findOne({ where: { token: tokenString } })
      if (!token) {
        return res.status(401).json({ error: 'invalid token' })
      }
      req.savedToken = token
      
      const decodedToken = jwt.verify(tokenString, SECRET)
      const user = await User.findByPk(decodedToken.id)
      const disabled = user.disabled
      const expired = new Date() > new Date(token.expires)

      if (disabled) {
        token.destroy()        
        return res.status(401).json({ error: 'user is disabled' })
      }
      else if (expired) {
        token.destroy()   
        return res.status(401).json({ error: 'token is expired' })
      }
      req.decodedToken = decodedToken

    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  blogFinder,
  userFinder,
  tokenExtractor
}