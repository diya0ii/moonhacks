import mongoose from "mongoose";

type ConnectionObject = {
    isConnected? : number
  }

const connection : ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        return;
    }
    
    
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "bhag ja yha se !👍🤪",{})
       
        
        connection.isConnected = db.connections[0].readyState
        console.log("MongoDB Connected Successfully")

    } catch (error) {

        console.log("Database connection failed",error);
        
        process.exit(1);
    }

}

export default dbConnect;