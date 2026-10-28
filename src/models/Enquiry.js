import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [120, 'Name cannot exceed 120 characters']
    },
    phone: {
        type: String,
        required: [true, 'Please provide your phone number'],
        trim: true,
        maxlength: [30, 'Phone number cannot exceed 30 characters']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
    },
    enquiry: {
        type: String,
        required: [true, 'Please provide your enquiry details'],
        trim: true,
        maxlength: [4000, 'Enquiry cannot exceed 4000 characters']
    },
    viewed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
