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
    const { userId, name, archetype, personality, avatar } = await request.json();

    if (!userId || !name || !archetype || !personality) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const assistantId = `assistant_${Date.now()}`;
    const assistantData = {
      assistantId,
      userId,
      name,
      archetype,
      personality,
      avatar: avatar || { type: 'default', avatarId: 'default_1' },
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      totalMessages: 0
    };

    // Save to DynamoDB
    await dynamodb.put({
      TableName: 'epai-assistants',
      Item: assistantData
    }).promise();

    return NextResponse.json({
      success: true,
      id: assistantId,
      assistant: assistantData
    });

  } catch (error) {
    console.error('Create assistant error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assistantId = searchParams.get('id');

    if (!assistantId) {
      return NextResponse.json({ error: 'Assistant ID required' }, { status: 400 });
    }

    // Get from DynamoDB
    const result = await dynamodb.get({
      TableName: 'epai-assistants',
      Key: { assistantId }
    }).promise();

    if (!result.Item) {
      return NextResponse.json({ error: 'Assistant not found' }, { status: 404 });
    }

    return NextResponse.json(result.Item);

  } catch (error) {
    console.error('Get assistant error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}