import { readFileSync } from 'node:fs'

export function authenticate(req, res, next) {
  try {
    // const { username, password } = req.headers
    const username = req.headers.authorization.Username
    const password = req.headers.authorization.Password
    const filePath = new URL('../authorizedUsers.json', import.meta.url)
    const file = readFileSync(filePath, { 'encoding': 'utf-8' })
    const authorizedUsers = JSON.parse(file)
    if (authorizedUsers.admin.some(userInfo => userInfo.username === username && userInfo.password === password)) {
      req.isAdmin = true
      next()
    }
    else if (authorizedUsers.regularUser.some(userInfo => userInfo.username === username && userInfo.password === password)) {
      next()
    } else {
      res.status(401).json({ sucess: false, message: "wrong username or password" })
    }

  } catch (err) {
    console.log(`error reading file: ${err}`)
  }
}

export function isAdmin(req, res, next){
  if (req.isAdmin){
    next()
  }
}
