import { NextRequest, NextResponse } from 'next/server';
import * as AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'ap-southeast-3',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function POST(request: NextRequest) {
  try {
    const { message, assistantId } = await request.json();

    if (!assistantId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if message contains calendar info
    const hasCalendarInfo = message.includes('Calendar info:');
    
    let aiResponse;
    if (hasCalendarInfo) {
      const parts = message.split('Calendar info:');
      const userMsg = parts[0].trim();
      const calendarInfo = parts[1].trim();
      
      aiResponse = {
        response: `Based on your calendar: ${calendarInfo}\n\nRegarding "${userMsg}" - I can help you manage your schedule! Would you like me to add an event, check for conflicts, or provide more details about your upcoming meetings?`,
        provider: "dashboard-api",
        processingTime: 0.8
      };
    } else {
      aiResponse = {
        response: `Hello! I received your message: "${message}". I'm your AI assistant running on Dashboard API! I can help with your calendar, schedule meetings, and much more! Try asking "What's my schedule today?" or "What meetings do I have upcoming?"`,
        provider: "dashboard-api",
        processingTime: 0.8
      };
    }

    // Save conversation to DynamoDB
    const conversationId = `${assistantId}_${Date.now()}`;
    const timestamp = Date.now();
    
    await dynamodb.put({
      TableName: 'epai-conversations',
      Item: {
        conversationId,
        timestamp,
        assistantId,
        userMessage: message,
        assistantResponse: aiResponse.response,
        provider: aiResponse.provider,
        processingTime: aiResponse.processingTime,
        createdAt: new Date().toISOString()
      }
    }).promise();

    return NextResponse.json({
      success: true,
      response: aiResponse.response,
      provider: aiResponse.provider,
      responseTime: aiResponse.processingTime,
      conversationId
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}