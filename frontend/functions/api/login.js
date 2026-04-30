const BMOB_APP_ID = 'f33a06a03b05f0795367d32767f21c63';
const BMOB_REST_KEY = 'e309b64d6176f40dea125aa38bf8a2e4';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  const targetUrl = `https://api.bmobcloud.com/1/login${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('X-Bmob-Application-Id', BMOB_APP_ID);
  headers.set('X-Bmob-REST-API-Key', BMOB_REST_KEY);
  headers.set('Content-Type', 'application/json');
  headers.delete('Host');

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers,
    body: request.body
  });

  return fetch(proxyRequest);
}
