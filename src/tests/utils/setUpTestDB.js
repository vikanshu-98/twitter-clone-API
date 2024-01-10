
import mongoose from 'mongoose';
import connectdb from '../../config/db'
import removeCollections from '../../config/db'

const setUpTestDb=()=>{
    // console.log('db connected');
    beforeAll(async () => {await connectdb.connectdb();mongoose.set('strictQuery', false);})
    
    beforeEach(async ()=>{
        // console.log('empty collection');
        await removeCollections.removeCollections()
    })
    afterAll(async ()=> await mongoose.disconnect())
}

module.exports= setUpTestDb