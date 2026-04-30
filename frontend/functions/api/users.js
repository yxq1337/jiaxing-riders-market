const BMOB_APP_ID = 'f33a06a03b05f0795367d32767f21c63';
const BMOB_REST_KEY = 'e309b64d6176f40dea125aa38bf8a2e4';

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  // Get the objectId from params or extract from URL
  let objectId = '';
  const pathMatch = url.pathname.match(/\/api\/users\/(.+)$/);
  if (pathMatch) {
    objectId = '/' + pathMatch[1];
  }

  const targetUrl = `https://api.bmob.com/1/users${objectId}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('X-Bmob-Application-Id', BMOB_APP_ID);
  headers.set('X-Bmob-REST-API-Key', BMOB_REST_KEY);
  headers.set('Content-Type', 'application/json');

  const sessionToken = headers.get('X-Bmob-Session-Token');
  if (sessionToken) {
    headers.set('X-Bmob-Session-Token', sessionToken);
  }

  headers.delete('Host');

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null
  });

  return fetch(proxyRequest);
}
