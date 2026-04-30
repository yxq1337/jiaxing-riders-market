const BMOB_APP_ID = 'f33a06a03b05f0795367d32767f21c63';
const BMOB_REST_KEY = 'e309b64d6176f40dea125aa38bf8a2e4';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Bmob-Application-Id, X-Bmob-REST-API-Key, X-Bmob-Session-Token, Authorization',
  'Access-Control-Max-Age': '86400'
};

export async function onRequest(context) {
  const { request } = context;

  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: CORS_HEADERS
    });
  }

  const url = new URL(request.url);
  const targetUrl = `https://api.bmobcloud.com/1/login${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('X-Bmob-Application-Id', BMOB_APP_ID);
  headers.set('X-Bmob-REST-API-Key', BMOB_REST_KEY);
  headers.set('Content-Type', 'application/json');
  headers.delete('Host');
  headers.delete('Origin');
  headers.delete('Referer');

  try {
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null
    });

    const response = await fetch(proxyRequest);
    const responseBody = await response.text();

    const newHeaders = new Headers(response.headers);
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    return new Response(responseBody, {
      status: response.status,
      headers: newHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  }
}
