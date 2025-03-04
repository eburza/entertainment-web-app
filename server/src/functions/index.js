// The actual serverless function is in api.ts to be used with netlify functions (ensures the functions directory is properly created
module.exports = {
  handler: async () => {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Server is running' })
    };
  }
}; 