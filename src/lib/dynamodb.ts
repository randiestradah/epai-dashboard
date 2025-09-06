import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-3',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

export const dynamodb = {
  // Users
  async getUsers(limit = 50) {
    const command = new ScanCommand({
      TableName: 'epai-users',
      Limit: limit,
    });
    return await docClient.send(command);
  },

  async getUser(userId: string) {
    const command = new GetCommand({
      TableName: 'epai-users',
      Key: { userId },
    });
    return await docClient.send(command);
  },

  // Conversations for activity monitoring
  async getRecentConversations(limit = 100) {
    const command = new ScanCommand({
      TableName: 'epai-conversations',
      Limit: limit,
    });
    return await docClient.send(command);
  },

  // Dashboard-specific tables
  async logActivity(activityId: string, data: Record<string, unknown>) {
    const command = new PutCommand({
      TableName: 'dashboard_activity',
      Item: {
        activityId,
        timestamp: Date.now(),
        ...data,
      },
    });
    return await docClient.send(command);
  },

  async getActivity(limit = 100) {
    const command = new ScanCommand({
      TableName: 'dashboard_activity',
      Limit: limit,
    });
    return await docClient.send(command);
  },

  async saveMetric(metricId: string, value: number, metadata?: Record<string, unknown>) {
    const command = new PutCommand({
      TableName: 'dashboard_metrics',
      Item: {
        metricId,
        timestamp: Date.now(),
        value,
        metadata,
      },
    });
    return await docClient.send(command);
  },

  async getMetrics(metricId: string, limit = 100) {
    const command = new QueryCommand({
      TableName: 'dashboard_metrics',
      KeyConditionExpression: 'metricId = :metricId',
      ExpressionAttributeValues: { ':metricId': metricId },
      Limit: limit,
      ScanIndexForward: false,
    });
    return await docClient.send(command);
  },
};