import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = 'https://chokho-backend.onrender.com/heatmap';
    console.log(`Pinging backend keep-awake endpoint: ${backendUrl}`);

    const response = await fetch(backendUrl, {
      method: 'GET',
      // Adding a cache-busting header if needed, but for Render wakeup it shouldn't matter
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend ping failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Backend pinged successfully',
      timestamp: new Date().toISOString() 
    });
  } catch (error: any) {
    console.error('Cron error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
