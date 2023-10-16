const response=(req,res,next)=>{
    res.success= function(status=200,message="success"){
        return res.status(status).json({status,message})
    },
    res.data=function(data,status=200,message="success"){
        return res.status(status).json({status,message,data})
    },
    // res.error=function(data,status=200,message="success"){
    //     return res.status(status).json({status,message,data})
    // }
    next()
}

export default response