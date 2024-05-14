function calculateCorsHeaders(request) {
  const allowedOriginHostnames = [];
  const origin = request.headers.get('Origin');
  if (origin) {
    try {
      const originUrl = new URL(origin);
      for (const originHostnameRegex of allowedOriginHostnames)
        if (originHostnameRegex.test(originUrl.hostname))
          return {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': origin
          };
      return;
    } catch (error) {
      return;
    }
  }
  return;
}

function calculateUserAgent(request) {
  const allowedUserAgents = [];
  const ua = request.headers.get('User-Agent');
  if (ua) {
    for (const userAgentRegex of allowedUserAgents)
      if (userAgentRegex.test(ua))
        return true;
    return false;
  }
  return false;
}

async function handleRequest(request) {
  if (request.method === 'OPTIONS') {
    return new Response('OK', {
      headers: calculateCorsHeaders(request) || {}
    });
  }
  return getLocation(request);
}

async function getLocation(request) {
  const corsHeaders = calculateCorsHeaders(request);
  if (!corsHeaders && !calculateUserAgent(request))
    return new Response('Forbidden', {
      status: 403
    });
  const response = {};
  if (request.cf) {
    const cf = request.cf;
    if (request.headers.get('cf-connecting-ip')) response.ip = request.headers.get('cf-connecting-ip');
    if (cf.continent) response.continent = cf.continent;
    if (cf.longitude) response.longitude = cf.longitude;
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
      ...corsHeaders,
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
