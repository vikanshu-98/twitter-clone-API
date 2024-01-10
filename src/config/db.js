import monoose from 'mongoose'
import config from '../config'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
const connectdb = async ()=>{
    monoose.connect(config.mongoose.uri)
}

const removeCollection= async function(c){
   return new Promise((resolve,reject)=>{
        c.deleteMany().then(resolve).catch(err=> reject(err))
   })

}

const removeCollections = async ()=>{
    await Promise.all(_.map(monoose.connection.collections,(c)=>removeCollection(c)))
}
 
const seedDB= async ()=>{

    await removeCollections() 
    console.log('seeding the data into db..')
    const data = JSON.parse(fs.readFileSync(path.join(process.cwd(),'data','databaseSeed.json'),'utf-8'))
  
    for(let collection in data){
        const modelsName=_.upperFirst(collection.slice(0,-1))
        
        const model = monoose.models[modelsName]
        if( !model)
            throw new Error(`mongo model ${model} does not exist!!`)
        
        await model.insertMany(data[collection])

    }
    console.log('✅ Seed Data Inserted');
    
} 

export default {
    connectdb,seedDB,removeCollections

}