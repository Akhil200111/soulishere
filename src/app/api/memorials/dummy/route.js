import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Memorial from '@/models/Memorial';

// GET - Get the public dummy memorial
export async function GET(request) {
    try {
        await connectDB();
        
        const dummyMemorial = await Memorial.findOne({ isDummy: true });
        
        if (!dummyMemorial) {
            // Return a fallback mock memorial if one hasn't been created by the admin yet
            const fallbackMemorial = {
                firstName: 'Demo',
                lastName: 'Memorial',
                birthDate: '1950-01-01T00:00:00.000Z',
                deathDate: '2020-01-01T00:00:00.000Z',
                biography: 'This is a sample biography. An admin has not configured the dummy memorial yet, so this fallback data is being displayed. To customize this page, please log into the admin panel and navigate to the Demo Memorial tab.',
                profession: 'Sample Profile',
                coverPicture: '',
                profilePicture: '',
                lifeSummary: 'A life well lived.',
            };
            return NextResponse.json({ success: true, data: fallbackMemorial });
        }

        return NextResponse.json({ success: true, data: dummyMemorial });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
