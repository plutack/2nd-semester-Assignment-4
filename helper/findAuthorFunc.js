import { readFile, writeFile } from 'fs'

export async function readDB () {
  return new Promise((resolve, reject) => {
    readFile('./authordb.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export async function findAuthor (authorId) {
  try {
    console.log('authorId:', authorId)
    const data = await readDB()
    const authors = JSON.parse(data)
    const author = authors.find((author) => author.authorID === authorId)
    console.log(author)
    return author
  } catch (err) { console.log('server error: ', err) }
}
export async function findAuthorIndex (authorId) {
  try {
    console.log('authorId:', authorId)
    const data = await readDB()
    const authors = JSON.parse(data)
    const authorIndex = authors.findIndex((author) => author.authorID === authorId)
    return authorIndex
  } catch (err) { console.log('server error: ', err) }
}

export async function writeDB (data) {
  return new Promise((resolve, reject) => {
    writeFile('./authordb.json', JSON.stringify(data), (err) => {
      if (err) {
        console.error('Error writing file:', err)
        reject(err)
      } else {
        resolve('Data written to file')
      }
    })
  })
}

// export default { readDB, findAuthor }
