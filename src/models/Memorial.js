import mongoose from 'mongoose';

const memorialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: [true, 'Please add first name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Please add last name'],
        trim: true
    },
    birthDate: {
        type: Date,
        required: [true, 'Please add birth date']
    },
    deathDate: {
        type: Date,
        required: [true, 'Please add death date']
    },
    profilePicture: {
        type: String,
        default: ''
    },
    coverPicture: {
        type: String,
        default: ''
    },
    biography: {
        type: String,
        default: ''
    },
    lifeSummary: {
        type: String,
        default: ''
    },
    memorialQuote: {
        type: String,
        default: ''
    },
    achievements: {
        type: String,
        default: ''
    },
    profession: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    cemeteryName: {
        type: String,
        default: ''
    },
    graveLocation: {
        type: String,
        default: ''
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    youtubeVideos: [{
        title: String,
        url: String,
        description: String
    }],
    galleryPhotos: [{
        url: String,
        description: String
    }],
    familyMembers: [{
        id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString()
        },
        relationship: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        dates: {
            type: String,
            default: ''
        },
        gender: {
            type: String,
            default: ''
        },
        avatarUrl: {
            type: String,
            default: ''
        },
        parentIds: [{
            type: String
        }],
        spouseIds: [{
            type: String
        }],
        generation: {
            type: Number,
            default: 0
        },
        memorialRefId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Memorial',
            default: null
        },
        bio: {
            type: String,
            default: ''
        }
    }],
    lifeEvents: [{
        title: String,
        date: Date,
        description: String
    }],
    guestBookEntries: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatarUrl: { type: String, default: '' },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['APPROVED', 'PENDING', 'REJECTED', 'HIDDEN'],
            default: 'APPROVED'
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        likes: [{
            type: String
        }],
        replies: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: () => new mongoose.Types.ObjectId()
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: null
            },
            name: { type: String, required: true },
            email: { type: String, required: true },
            avatarUrl: { type: String, default: '' },
            message: { type: String, required: true },
            status: {
                type: String,
                enum: ['APPROVED', 'PENDING', 'REJECTED', 'HIDDEN'],
                default: 'APPROVED'
            },
            likes: [{
                type: String
            }],
            date: {
                type: Date,
                default: Date.now
            }
        }],
        date: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
        enum: ['draft', 'requested', 'published'],
        default: 'draft'
    },
    paymentId: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', null],
        default: null
    },
    paymentAmount: {
        type: Number,
        default: null
    },
    paidAt: {
        type: Date,
        default: null
    },
    qrGenerated: {
        type: Boolean,
        default: false
    },
    hugCount: {
        type: Number,
        default: 0
    },
    isDummy: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field and ensure family members have unique ids before saving
memorialSchema.pre('save', function () {
    this.updatedAt = Date.now();
    if (this.familyMembers && Array.isArray(this.familyMembers)) {
        this.familyMembers.forEach(member => {
            if (!member.id) {
                member.id = new mongoose.Types.ObjectId().toString();
            }
        });
    }
});

// Delete the existing model to prevent caching issues in development
if (mongoose.models.Memorial) {
    delete mongoose.models.Memorial;
}

export default mongoose.model('Memorial', memorialSchema);
