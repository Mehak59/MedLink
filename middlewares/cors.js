const cors = require('cors')

const corsOptions = {
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}

const allowCors = cors(corsOptions)
module.exports = allowCors
