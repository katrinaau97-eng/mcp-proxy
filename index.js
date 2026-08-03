export default {
  async fetch(request) {
    const url = new URL(request.url);
    // 从路径中提取目标地址（去掉开头的 /）
    const targetUrl = url.pathname.substring(1) + url.search;
    
    // 如果是访问根路径，显示提示
    if (!targetUrl || targetUrl === 'favicon.ico' || targetUrl === '') {
      return new Response('CORS Proxy for SullyOS is running.', { status: 200 });
    }

    // 转发原请求
    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow'
    });

    const response = await fetch(newRequest);
    const newHeaders = new Headers(response.headers);

    // 添加关键的 CORS 响应头
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id, X-API-Key, X-Project-Ref');
    newHeaders.set('Access-Control-Expose-Headers', 'Mcp-Session-Id');

    // 处理预检 OPTIONS 请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: newHeaders });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
};
