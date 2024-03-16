// Build app using express
// - create Author Router in another file
//   - this should have CRUD endpoints (Create, Read, Update, Delete)
//   - Link it to the main file (index.js or server.js or app.js, whatever you chose to use)
// - Add a global simple logger to the app. (like i showed you in class)

// import required modules
import express from 'express'
import logger from './middleware/logger.js'
import authorRouter from './routes/author.js'
import { authenticate } from './middleware/authenticate.js'
// initialize instnce of express
const app = express()

// get express to use middlewares
app.use(express.json())
app.use(logger, authorRouter)

// bind important variables to express instance
app.set('port', process.env.PORT || 3000)

// redirect all request to  '/' to /author
app.get('/', authenticate, (req, res) => {
  res.redirect('/authors')
  console.log('Redirecting to /authors')
})

// initialize request listening event
app.listen(app.get('port'), () =>
  console.log(`App started on http://localhost:${app.get('port')}`))
