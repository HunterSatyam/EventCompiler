import mongoose from 'mongoose';

// The URI provided by the user
const uri = "mongodb+srv://satyamkochas_db_user:FIpGgs9CwGkxeBT0@cluster0.gczxzbn.mongodb.net/event_aggregator?retryWrites=true&w=majority&appName=Cluster0";

console.log("Attempting to connect to MongoDB Atlas...");

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: Connected to MongoDB Atlas!");
        process.exit(0);
    })
    .catch(err => {
        console.error("ERROR: Could not connect to MongoDB Atlas.");
        console.error("Error details:", err.message);
        console.error("Possible causes:");
        console.error("1. IP Whitelist: Your current IP address might not be allowed in MongoDB Atlas Network Access.");
        console.error("2. Invalid Credentials: Username or password might be incorrect.");
        console.error("3. Network Issues: Firewall or proxy blocking the connection.");
        process.exit(1);
    });
