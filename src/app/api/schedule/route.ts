import { NextResponse } from 'next/server';
import { BTUParser } from '@/lib/parser/BTUParser';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  });
}

const auth = getAuth();
const db = getFirestore();

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.split('Bearer ')[1];
  
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    const parser = new BTUParser();
    const schedule = await parser.init();
    
    if (schedule && Object.keys(schedule).length > 0) {
      await db.collection('schedules').doc(userId).set({
        schedule,
        updatedAt: new Date().toISOString(),
        userId
      });
      
      return NextResponse.json({ schedule, success: true });
    }
    
    throw new Error('Schedule parsing incomplete');
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}