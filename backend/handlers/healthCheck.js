// HEALTH CHECK HANDLER: Provides health status for the Manifest backend with CORS support
module.exports = async (req, res, manifest) => {
  const timestamp = new Date().toISOString();
  const appId = req.get('X-App-ID') || 'Unknown';
  console.log('🔍 [HEALTH] Health check requested at ' + timestamp + ', App ID: ' + appId);
  console.log('🔍 [HEALTH] Request method: ' + req.method + ', URL: ' + req.url);
  
  // Add basic CORS headers for health endpoint
  const allowedOrigins = process.env.ALLOWED_ORIGINS || '*';
  if (allowedOrigins === '*') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    const origin = req.get('Origin');
    if (origin && allowedOrigins.split(',').some(o => o.trim() === origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-App-ID');
  
  try {
    const healthStatus = {
      status: 'ok',
      timestamp: timestamp,
      appId: appId,
      manifest: 'running',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      port: process.env.PORT || '1111'
    };
    
    console.log('✅ [HEALTH] Health check successful:', healthStatus);
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('❌ [HEALTH] Health check error:', error);
    
    const errorStatus = {
      status: 'error',
      timestamp: timestamp,
      appId: appId,
      error: error.message
    };
    
    res.status(500).json(errorStatus);
  }
};