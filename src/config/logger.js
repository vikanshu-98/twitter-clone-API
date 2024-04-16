import pino, { destination } from 'pino'
import pretty from 'pino-pretty'

const p = pretty({
    colorize:true,
    translateTime:"yyyy-mm-dd, h:mm:ss TT",
    sync:true, 
    // destination:"server.log",
     
})
const logger = pino(p )

export default logger   