const authService = require('../../../../lib/auth');

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    const result = await authService.login(email, password, ipAddress, userAgent);

    return Response.json({
      success: true,
      token: result.token,
      user: result.user
    });

  } catch (error) {
    return Response.json(
      { 
        success: false, 
        error: error.message === 'Invalid credentials' ? 
               'Invalid email or password' : 
               'Login failed'
      },
      { status: 401 }
    );
  }
}