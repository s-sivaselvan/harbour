const mongoose=require("mongoose")

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb Connected Successfully!")
    }
    catch(error){
        console.error("Mongodb Connection Failed")
        process.exit(1)
    }
}

module.exports=connectDB