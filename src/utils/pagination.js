 

const paginatePlugin=(schema)=>{
    schema.statics.paginate = async function(options,filters){
        let sort='';
        if(options.sortBy){
            const sortCriteria = []
            options.sortBy.split(',').forEach(element => {
                const [key,val] = element.split(':') 
                sortCriteria.push(((val=='desc')? '-':'')+key)
            });
            sort = sortCriteria.join(' ')
        }else{
            sort='-createdAt'; 
        }

        const limit = options.limit && parseInt(options.limit,10) > 0 ? parseInt(options.limit,10):10
        const page = options.page && parseInt(options.page,10) > 0 ? parseInt(options.page,10):1
        const offset = (page -1 ) * limit
        const count = await this.countDocuments(filters).exec()
        let result =  this.find(filters).skip(offset).limit(limit).select('-password  -updatedAt -__v')
        if(options.populate){
            result.populate(options.populate)
        }
        result = result.exec();
        return Promise.all([count,result]).then(values=>{
            const [totalResults,results] = values
            const totalPage = Math.ceil(totalResults/limit)
            const data={
                results,
                page,
                limit,
                totalPage,
                totalResults
            }

            return Promise.resolve(data)
        })
    }
}

export default paginatePlugin