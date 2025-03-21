exports.handler = async (event) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
      headers: {
        'Allow': 'GET'
      }
    };
  }

  // Parse the URL parameter
  const targetUrl = event.queryStringParameters.url;
  
  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing "url" query parameter' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://emilia-burza-entertainment-app.netlify.app',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    };
  }

  try {
    // Fetch the target URL
    const response = await fetch(targetUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    // Return the response with CORS headers
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://emilia-burza-entertainment-app.netlify.app',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://emilia-burza-entertainment-app.netlify.app',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
      }
    };
  }
};
