// Catch async errors in route handlers

module.exports = fn => {
  return (req, res, next) => {
    // Pass error to next middleware
    fn(req, res, next).catch(err => next(err)); 
  };
};