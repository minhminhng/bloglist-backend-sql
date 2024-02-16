const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { blogFinder, tokenExtractor, errorHandler } = require('./util/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())
// app.use(tokenExtractor)
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogFinder, blogsRouter)
app.use('/api/users', usersRouter)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()