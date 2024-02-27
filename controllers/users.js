const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { userFinder } = require('../util/middleware')

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
    })
    res.json(users)
  }
  catch (error) {
    next(error)
  }

})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    return res.json(user)
  } 
  catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  let  read = {
    [Op.in]: [true, false]
  }

  if (req.query.read)
   {
    read = req.query.read === "true"
   }

  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['name', 'username'] ,
      include: [
        {
          model: Blog,
          as: 'readings',
          attributes: ['id', 'title', 'url', 'author', 'likes', 'year'],
          through: {
            as: 'readinglists',
            attributes: ['read', 'id'],
            where: { read }
          }
        }
      ]
    })
    res.json(user)
  }
  catch(error) {
    next(error)
  }
})

router.put('/:username', userFinder, async (req, res, next) => {
  const { username }= req.body
  if (req.user) {
    if (username) {
      req.user.username = req.body.username
    }    
    await req.user.save()
    res.json(req.user)
  } else {
    next(new Error('user does not exist' ))
  }
})

router.delete('/:username', userFinder, async (req, res) => {
  if (req.user) {
    await req.user.destroy()
  }
  res.status(204).end
})

module.exports = router