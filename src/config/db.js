import monoose from 'mongoose'
import config from '../config'
const connectdb = async ()=>{
    monoose.connect(config.mongoose.uri)
}


export default {
    connectdb
}