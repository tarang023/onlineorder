import mongoose from 'mongoose';

export async function connect() {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        const connection =mongoose.connection;
        connection.on('connected', () => {
            console.log("Connected to DB");
        })

        connection.on('error', (err) => {
            console.log("DB connection error please make sure db is on", err);
            process.exit(1);
        })

        console.log("Connected to DB");
    }catch(err){
        console.log("something went wrong in connecting to DB",err);
    }
}