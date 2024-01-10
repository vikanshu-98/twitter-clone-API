import express from 'express';
import getRoutes from './routes';
import testDataRoutes from './routes/testDataRoutes'
import  error from './utils/error'
import response from './utils/response';
import JwtStrategy from './utils/passport';
import passport from 'passport';
import config from "./config"
const app = express();
app.use(express.json())

//jwt authtenication

app.use(passport.initialize())
passport.use(JwtStrategy)

app.use(response);
app.use('/api',getRoutes())
if(config.env =='development' || config.env =='test'){
app.use('/testData',testDataRoutes)
}

 
app.use(error.handleNotFound) //404 error handleer

app.use(error.handleError) //error handler


export default app;