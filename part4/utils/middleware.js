const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }

  next()
}

const userExtractor = (request, response, next) => {
  if (!request.token) {
    request.user = null
    return next()
  }

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = decodedToken
    next()
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }
}

module.exports = {
  tokenExtractor,
  userExtractor,
}
