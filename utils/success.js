export const CreateSuccess = (statusCode, succesMessage, data) =>{
    const successObject = {
        status : statusCode,
        message : succesMessage,
        data : data
    }
    return successObject;   
}