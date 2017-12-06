let express=require('express');
let bodyParser=require('body-parser');
let proxy=require('http-proxy-middleware');
let proxyConfig=require('./proxy.config');
let querystring=require('querystring');

let app=express();
app.listen(8333);

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header('Access-Control-Allow-Credentials','true');
	res.header("X-Powered-By",' 3.2.1');
	if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
	else  next();
});

let createProxySetting=function (url) {
	return {
		target: url,
		changeOrigin: true,
		headers: {
			Accept: 'application/json',
			'X-Requested-With': 'XMLHttpRequest'
		},
		onProxyReq: function (proxyReq, req) {
			if (req.method === 'POST' && req.body) {
				const bodyData = querystring.stringify(req.body);
				proxyReq.write(bodyData)
			}
		}
	}
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
proxyConfig.forEach(function (item) {
	app.use(item.url, proxy(createProxySetting(item.target)))
});

