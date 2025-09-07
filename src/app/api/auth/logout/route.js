const authService = require('../../../../lib/auth');

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      await authService.logout(token);
    }

    return Response.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    return Response.json({
      success: true,
      message: 'Logged out'
    });
  }
}