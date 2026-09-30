import mongoose from 'mongoose';
import Memorial from './src/models/Memorial.js';

const MONGODB_URI = "mongodb+srv://officialsoulishere_db_user:cOeuyJ8yjUAtDFNe@cluster0.m9dzzaf.mongodb.net/memorial-platform?appName=Cluster0";

async function test() {
    try {
        await mongoose.connect(MONGODB_URI);
        const dummy = await Memorial.findOne({ isDummy: true });
        if (!dummy) {
            console.log("No dummy found");
            process.exit(0);
        }
        
        const data = {
            firstName: "Demo",
            lastName: "Memorial",
            birthDate: "1950-01-01",
            deathDate: "2020-01-01",
            familyMembers: [],
            lifeEvents: []
        };
        
        dummy.set(data);
        await dummy.save();
        console.log("Success!");
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}
test();
