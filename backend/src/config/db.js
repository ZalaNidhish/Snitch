import mongoose  from "mongoose";
import {MONGO_URI} from './config.js'

export async function connectDB() {

    try{
            await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected Successfully ... ');
    }catch(err){
        console.log("MongoDB ERROR: ", err);
    }

}

