// import neccessary modules
import { readDB, writeDB, findAuthor, findAuthorIndex } from '../helper/findAuthorFunc.js'
import express from 'express'

// create a router instance
const authorRouter = express.Router()

// create CRUD endpoints

// route to get all authors
authorRouter.get('/authors', (req, res) => {
  readDB().then((data) => {
    const authors = JSON.parse(data)
    res.send(authors)
  }).catch((err) => {
    console.error('Error reading file:', err)
    res.status(500).send('Internal Server Error')
  })
})

// route to get a single author
authorRouter.get('/authors/:id', async (req, res) => {
  // use async and await to handle promise
  try {
    console.log(req.params)
    const authorId = req.params.id
    const author = await findAuthor(authorId)
    if (author) {
      res.json(author)
    } else {
      res.status(404).send('Author not found')
    }
  } catch (err) { console.log('server error: ', err) }
})

// route to add a new author
authorRouter.post('/authors', (req, res) => {
  // use then and catch to handle promise
  readDB().then((data) => {
    console.log(typeof data)
    const authors = JSON.parse(data)
    const newAuthor = req.body
    /* example/format of newAuthor passed to body as JSON: {
    "authorID": "rrn",
    "authorName": "Rick Riordan",
    "books": [
        "Percy Jackson Book Series",
        "The Kane Chronicles"
    ]
} */

    authors.push(newAuthor)
    writeDB(authors)
    res.status(200).send(authors)
  }).catch((err) => {
    console.error('Error :', err)
    res.status(500).send('Internal Server Error')
  })
})

// route to update an author book titles
authorRouter.put('/authors/:id', async (req, res) => {
  // add new book(s) to existing author
  /* example/format of newBook passed to body as JSON: {
    "newBooksArray": [
        "Defiant",
        "Cytonic"
    ]
} */
  try {
    const authorDB = JSON.parse(await readDB())
    console.log(typeof authorDB)
    const authorId = req.params.id
    const authorIndex = await findAuthorIndex(authorId)
    const newBook = req.body

    if (newBook.newBooksArray && authorIndex !== -1) {
      authorDB[authorIndex].books = authorDB[authorIndex].books.concat(newBook.newBooksArray)
      await writeDB(authorDB)
      res.status(200).json({ success: true, author: authorDB[authorIndex], message: `${newBook.newBooksArray.length} books added successfully` })
    }
  } catch (error) {
    console.log('server error: ', error)
    res.status(500).send('Internal Server Error')
  }
})

// .patch() is unlikely too be needed

// route to delete an author
authorRouter.delete('/authors/:id', async (req, res) => {
  try {
    const authorDB = JSON.parse(await readDB())
    const authorId = req.params.id
    const authorIndex = await findAuthorIndex(authorId)
    if (authorIndex !== -1) {
      authorDB.splice(authorIndex, 1)
      await writeDB(authorDB)
      res.status(200).json({ success: true, message: 'Author deleted successfully' })
    } else {
      res.status(404).send('Author not found')
    }
  } catch (error) {
    console.log('server error: ', error)
    res.status(500).send('Internal Server Error')
  }
})
export default authorRouter
