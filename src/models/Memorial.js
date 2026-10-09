import mongoose from 'mongoose';
import crypto from 'crypto';

export function extractYouTubeVideoId(url) {
    if (!url) return '';
    const trimmed = String(url).trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }
    const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?$/i;
    const match = trimmed.match(youtubeUrlRegex);
    return (match && match[1]) ? match[1] : '';
}

const youtubeVideoSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    memorialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Memorial',
        default: null
    },
    title: {
        type: String,
        required: [true, 'Please add video title'],
        trim: true
    },
    youtubeUrl: {
        type: String,
        required: [true, 'Please add YouTube URL'],
        trim: true
    },
    youtubeVideoId: {
        type: String,
        required: [true, 'Please add YouTube video ID'],
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

youtubeVideoSchema.virtual('id').get(function () {
    return this._id ? this._id.toString() : null;
});

youtubeVideoSchema.virtual('url').get(function () {
    return this.youtubeUrl || '';
});

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
        default: '/cover_picture.jpg'
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
    youtubeVideos: [youtubeVideoSchema],
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
        enum: ['draft', 'requested', 'published', 'rejected'],
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
    qrAccessKey: {
        type: String,
        default: function () {
            return crypto.randomBytes(16).toString('hex');
        }
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

// Update the updatedAt field and ensure subdocuments are properly formatted before saving
memorialSchema.pre('save', function () {
    this.updatedAt = Date.now();
    if (!this.qrAccessKey) {
        this.qrAccessKey = crypto.randomBytes(16).toString('hex');
    }
    if (this.familyMembers && Array.isArray(this.familyMembers)) {
        this.familyMembers.forEach(member => {
            if (!member.id) {
                member.id = new mongoose.Types.ObjectId().toString();
            }
        });
    }
    if (this.youtubeVideos && Array.isArray(this.youtubeVideos)) {
        this.youtubeVideos.forEach((video, index) => {
            if (!video._id) {
                video._id = new mongoose.Types.ObjectId();
            }
            if (!video.memorialId && this._id) {
                video.memorialId = this._id;
            }
            if (!video.youtubeUrl && video.url) {
                video.youtubeUrl = video.url;
            }
            if (!video.youtubeVideoId && video.youtubeUrl) {
                video.youtubeVideoId = extractYouTubeVideoId(video.youtubeUrl);
            }
            if (typeof video.displayOrder !== 'number') {
                video.displayOrder = index;
            }
            if (!video.createdAt) {
                video.createdAt = Date.now();
            }
            video.updatedAt = Date.now();
        });
    }
});

// Delete the existing model to prevent caching issues in development
if (mongoose.models.Memorial) {
    delete mongoose.models.Memorial;
}

export default mongoose.model('Memorial', memorialSchema);
