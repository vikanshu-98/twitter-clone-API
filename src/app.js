import express from 'express';
import getRoutes from './routes';
import  error from './utils/error'
import response from './utils/response';


const app = express(); 

app.use(express.json())
app.use(response);
app.use('/api',getRoutes())

 
app.use(error.handleNotFound) //404 error handleer

app.use(error.handleError) //error handler


export default app;