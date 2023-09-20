const cloud = require('@sys/cloud')
const https = require("https")
const url = require('url');
const axios = cloud.fetch;
const ignoreSSLagent = new https.Agent({
  rejectUnauthorized: false
});

var proxy_servers = cloud.shared.has("proxy_servers") ? cloud.shared.get("proxy_servers") : [];
var headers = {}
//Cf JSproxy
//header = "--Ver: 10" && header="Access-Control-Allow-Origin: *" && cloud_name="Cloudflare"
var worker_host = 'https://f.openaimouj.uk'
var cloudflare = false;


exports.default  = async function (ctx) {
  var origin = ctx.request.headers["origin"];
  ctx.response.setHeader('Access-Control-Allow-Origin', origin && origin.trim() || '*');
  ctx.response.setHeader("Access-Control-Allow-Headers", '*');
  ctx.response.setHeader('Access-Control-Allow-Credentials', 'true');

  if (ctx.request.method === "OPTIONS") return;

  var cf_host = ctx.request.url.match(/^(\/.*?\/)(https?:\/.*?)$/i);
  var config = "";
  if (cf_host && cf_host.length > 2) {
    config = cf_host[1];
    cf_host = cf_host[2];
  } else {
    return "URL参数错误"
  }

  const parsedUrl = url.parse(cf_host);
  headers = ctx.request.headers;

  delete headers.host;
  delete headers['x-real-ip']
  delete headers['x-forwarded-for']
  delete headers['x-forwarded-host']
  delete headers['x-forwarded-proto']
  delete headers['x-forwarded-port']

  if (/\/cf\/(1|true)\//i.test(ctx.request.url)) {
    cloudflare = true;
  }

var buffer = ctx.buffer;

  if (headers['content-length']) headers['content-length'] = "" + buffer.length;
  try {
    if (cloudflare) {
      var referer = worker_host + '/?';//new URLSearchParams();encodeURIComponent
      for (let i in headers) {
        referer += (i + '=' + encodeURIComponent(headers[i] + '&'))
      }
      headers['referer'] = referer;
    }

  } catch (e) {
    return e.message
  }

  var resp = (await axios((cloudflare ? worker_host.concat('/http/') : '').concat(cf_host), { 
    responseType: 'stream',
     headers: headers, 
     method: ctx.request.method, 
    data: buffer, 
     validateStatus: () => { return true }, 
     httpsAgent: ignoreSSLagent })); 

    ctx.response.status(resp.status); 
    for (let i in resp.headers) { 
      if (!/^access-control-/i.test(i)) ctx.response.header(i, resp.headers[i])
    }; 

    return resp.data;
}
