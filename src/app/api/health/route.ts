import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'healthy',
    backend: 'apprunner',
    timestamp: new Date().toISOString(),
    version: '1.0'
  });
}