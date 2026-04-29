export async function onRequest(context) {
  const { request, params, env } = context
  const path = params.path.join('/')

  const url = new URL(request.url)
  const targetUrl = `https://api2.bmob.cn/1/${path}${url.search}`

  const headers = new Headers(request.headers)
  headers.set('X-Bmob-Application-Id', 'f33a06a03b05f0795367d32767f21c63')
  headers.set('X-Bmob-REST-API-Key', 'e309b64d6176f40dea125aa38bf8a2e4')
  headers.set('Content-Type', 'application/json')

  const token = headers.get('X-Bmob-Session-Token')
  if (token) {
    headers.set('X-Bmob-Session-Token', token)
  }

  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers,
    body: request.body
  })

  return fetch(newRequest)
}
