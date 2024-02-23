export default function logger (req, _, next) {
  console.log('Request', {
    method: req.method,
    url: req.url,
    time: new Date(),
    query: req.query,
    params: req.params
  })
  next()
}
