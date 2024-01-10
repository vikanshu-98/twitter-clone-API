import connectdb from '../src/config/db'
import  logger from '../src/config/logger'
import app from './app';
import config from './config';
let server;
 

connectdb.connectdb().then(()=>{
    logger.info('db connected..')
    server = app.listen(config.port,()=>{
        logger.info('server started on '+ config.port)
    })
}).catch(err=>logger.error(err))
 
const exitHandler =()=>{
    if(server){
        server.close(()=>{
            logger.info('server closed..');
            process.exit(1)
        })
    }else{
        process.exit(1)
    }
}

const unexpectedErrorHandler =(error)=>{
    logger.error(error);
    exitHandler();
}

process.on('uncaughtException',exitHandler);
process.on('unhandledRejection',unexpectedErrorHandler)

 