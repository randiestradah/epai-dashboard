const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let server;

const createNextServer = async () => {
  if (!server) {
    await app.prepare();
    server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });
  }
  return server;
};

exports.handler = async (event, context) => {
  const server = await createNextServer();
  
  return new Promise((resolve, reject) => {
    const req = {
      method: event.httpMethod,
      url: event.path + (event.queryStringParameters ? '?' + new URLSearchParams(event.queryStringParameters).toString() : ''),
      headers: event.headers,
      body: event.body,
    };

    const res = {
      statusCode: 200,
      headers: {},
      body: '',
      end: function(data) {
        this.body = data;
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },
      writeHead: function(statusCode, headers) {
        this.statusCode = statusCode;
        this.headers = { ...this.headers, ...headers };
      },
      write: function(data) {
        this.body += data;
      },
    };

    server.emit('request', req, res);
  });
};