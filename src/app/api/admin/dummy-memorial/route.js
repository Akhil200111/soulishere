import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { processFamilyMembers } from '@/lib/lineage';

// GET - Get the dummy memorial
export async function GET(request) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(session.id);
        if (user?.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
        }

        let dummyMemorial = await Memorial.findOne({ isDummy: true });

        // If it doesn't exist, create an empty one linked to this admin user
        if (!dummyMemorial) {
            dummyMemorial = await Memorial.create({
                isDummy: true,
                userId: session.id,
                firstName: 'Demo',
                lastName: 'Memorial',
                birthDate: new Date('1950-01-01'),
                deathDate: new Date('2020-01-01'),
                biography: 'This is a sample biography.',
                status: 'published'
            });
        }

        return NextResponse.json({ success: true, data: dummyMemorial });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

// PUT - Update the dummy memorial
export async function PUT(request) {
    try {
        const session = await getSession(request);
        if (!session) {
            return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(session.id);
        if (user?.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
        }

        const data = await request.json();

        if (data.familyMembers) {
            data.familyMembers = processFamilyMembers(data.familyMembers);
        }
        
        let dummyMemorial = await Memorial.findOne({ isDummy: true });
        
        if (!dummyMemorial) {
            // Should not really happen since GET creates it, but fallback just in case
            dummyMemorial = new Memorial({
                isDummy: true,
                userId: session.id,
                ...data
            });
            await dummyMemorial.save();
        } else {
            // Remove restricted fields from data update
            delete data._id;
            delete data.userId;
            delete data.isDummy;
            delete data.__v;
            delete data.createdAt;
            delete data.updatedAt;
            
            // Update fields safely using Mongoose's .set()
            dummyMemorial.set(data);
            await dummyMemorial.save();
        }

        return NextResponse.json({ success: true, data: dummyMemorial });
    } catch (err) {
        require('fs').writeFileSync('dummy_error.log', err.stack || err.message + '\n' + JSON.stringify(err.errors || {}));
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
