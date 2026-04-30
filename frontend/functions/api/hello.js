export function onRequest(context) {
  return new Response(JSON.stringify({ message: 'Cloudflare API working!' }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
