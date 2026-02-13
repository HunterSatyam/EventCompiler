import mongoose from 'mongoose';

// The Atlas URI currently in your .env
const uri = "mongodb+srv://satyamkochas_db_user:FIpGgs9CwGkxeBT0@cluster0.gczxzbn.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

console.log("Connecting to Atlas to check for data...");

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String
}, { strict: false }); // Strict false to verify any data

const User = mongoose.model('User', userSchema);

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected. Searching for users...");
        const users = await User.find({});
        console.log(`Found ${users.length} users in the Cloud Database:`);
        users.forEach(u => console.log(` - ${u.fullname} (${u.email})`));

        if (users.length > 0) {
            console.log("\nCONCLUSION: Data IS being stored, but it is in the CLOUD (Atlas), not on your LOCAL computer.");
        } else {
            console.log("\nCONCLUSION: No users found. The signup might have failed or database name is different.");
        }
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
