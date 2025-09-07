import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import axios from 'axios';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const dynamodb = DynamoDBDocumentClient.from(client);

// AI Gateway Configuration
const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'http://localhost:3002';

export async function POST(request: NextRequest) {
  try {
    const { message, assistantId, personality } = await request.json();

    if (!assistantId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Call AI Gateway service
    const aiResponse = await callAIGateway(message, personality, assistantId);

    // Save conversation to DynamoDB
    const conversationId = `${assistantId}_${Date.now()}`;
    const timestamp = Date.now();
    
    await dynamodb.send(new PutCommand({
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
    }));

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

// Call AI Gateway Service
async function callAIGateway(message: string, personality: any, assistantId: string) {
  try {
    const response = await axios.post(`${AI_GATEWAY_URL}/api/chat`, {
      message,
      personality,
      assistantId
    }, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.success) {
      return {
        response: response.data.response,
        provider: response.data.provider,
        processingTime: response.data.responseTime
      };
    } else {
      throw new Error(response.data.error || 'AI Gateway error');
    }
    
  } catch (error) {
    console.error('AI Gateway call failed:', error.message);
    
    // Fallback response
    return {
      response: "I'm having trouble connecting to my AI services right now. Please try again in a moment!",
      provider: "fallback",
      processingTime: 1000
    };
  }
}