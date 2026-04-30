const BMOB_APP_ID = 'f33a06a03b05f0795367d32767f21c63';
const BMOB_REST_KEY = 'e309b64d6176f40dea125aa38bf8a2e4';

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  // 提取 /api/ 后面的路径
  const fullPath = url.pathname;
  const apiMatch = fullPath.match(/^\/api\/(.*)$/);
  const path = apiMatch ? apiMatch[1] : (params.path ? params.path.join('/') : '');

  // 登录和用户路径直接到 Bmob 根，其他到 /classes
  let targetUrl;
  if (path === 'login' || path.startsWith('users')) {
    targetUrl = `https://api2.bmob.cn/1/${path}${url.search}`;
  } else {
    targetUrl = `https://api2.bmob.cn/1/classes/${path}${url.search}`;
  }

  const headers = new Headers(request.headers);
  headers.set('X-Bmob-Application-Id', BMOB_APP_ID);
  headers.set('X-Bmob-REST-API-Key', BMOB_REST_KEY);
  headers.set('Content-Type', 'application/json');

  const sessionToken = headers.get('X-Bmob-Session-Token');
  if (sessionToken) {
    headers.set('X-Bmob-Session-Token', sessionToken);
  }

  // 移除 Host 头，避免被目标服务器拒绝
  headers.delete('Host');

  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null
  });

  return fetch(proxyRequest);
}
