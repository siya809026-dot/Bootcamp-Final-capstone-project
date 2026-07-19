import mongoose from "mongoose";

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Successfully...");
    }
    catch (error) {
        console.log("Failed to Connect Database", error.message);
        process.exit(1);
    }
}

export default connectDb;