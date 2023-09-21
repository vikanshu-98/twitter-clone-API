import monoose from 'mongoose'

const connectDB = ()=>{
    monoose.connect()
}


export default {connectDB}