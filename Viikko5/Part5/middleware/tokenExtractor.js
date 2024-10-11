const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7); // Remove 'Bearer ' prefix
  } else {
    request.token = null; // Set to null if no token is found
  }
  next();
};

module.exports = tokenExtractor;
