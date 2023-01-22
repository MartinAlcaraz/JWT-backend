import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import usersRouter from './routes/user.js';
import cookieParser from 'cookie-parser';
import fs from 'fs'
import https from 'https'

if (process.env.NODE_ENV == 'development') {
  dotenv.config();    // carga el contenido del archivo .env dentro de process.env
}

const app = express();
const PORT = process.env.PORT || "3000";

if (process.env.NODE_ENV == 'development') {
  // crea el servidor con protocolo https
  https.createServer({
    key: fs.readFileSync('c:/localhost-key.pem'),
    cert: fs.readFileSync('c:/localhost.pem')
  }, app).listen(PORT, () => {
    console.log('Servidor en puerto ', PORT);
  });
} else {
  // settings
  app.set('port', process.env.PORT || "3000")
}

//middleware
app.use(cookieParser());

//app.use(cors()); 

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use(express.json()); // para que entienda los objetos json

//routes
app.use('/api/users', usersRouter);


export default app;


