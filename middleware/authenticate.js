import { readFileSync } from 'node:fs'

export function authenticate(req, res, next) {
  try {
    // authentication details is expected to be collected via header in for of username and password
    if (!req.headers.username || !req.headers.password) {
      return res.status(401).json({ sucess: false, message: "required login details not provided" })
    }
    const { username, password } = req.headers
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

// function  to check if user is admin
export function isAdmin(req, _, next) {
  if (req.isAdmin) {
    next()
  }
}
