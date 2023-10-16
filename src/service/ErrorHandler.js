export default class ErrorHandler extends Error{
    constructor(status,message){
        super()
        this.status=status
        this.message=message
    }

    static notFound(message="Route Not Found"){
       return  new ErrorHandler(404,message)
    }

    static badRequest(message="Bad Request"){
        return new ErrorHandler(400,message)
    }
}