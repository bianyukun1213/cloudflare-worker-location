function calculateCorsHeaders(request) {
  const allowedOriginHostnames = [];
  if (request.headers.get('Origin')) {
    try {
      const originUrl = new URL(request.headers.get('Origin'));
      if (allowedOriginHostnames.includes(originUrl.hostname.toLowerCase()))
        return {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': request.headers.get('Origin')
        };
      else
        return {};
    } catch (error) {
      return {};
    }
  }
  return {};
}

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response('OK', {
      headers: calculateCorsHeaders(request)
    });
  }
  return getLocation(request);
}

async function getLocation(request) {
  const response = {};
  if (request.cf) {
    const cf = request.cf;
    if (request.headers.get('cf-connecting-ip')) response.ip = request.headers.get('cf-connecting-ip');
    if (cf.continent) response.continent = cf.continent;
    if (cf.longitude) response.longitude = cf.longitude;
    if (cf.latitude) response.latitude = cf.latitude;
    if (cf.latitude) response.latitude = cf.latitude;
    if (cf.country) response.country = cf.country;
    if (cf.isEUCountry) response.isEUCountry = cf.isEUCountry;
    if (cf.city) response.city = cf.city;
    if (cf.postalCode) response.postalCode = cf.postalCode;
    if (cf.metroCode) response.metroCode = cf.metroCode;
    if (cf.region) response.region = cf.region;
    if (cf.regionCode) response.regionCode = cf.regionCode;
    if (cf.timezone) response.timezone = cf.timezone;
  }
  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
      ...calculateCorsHeaders(request),
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
