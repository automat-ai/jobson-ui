# Jobson UI

A web frontend for [Jobson](https://github.com/adamkewley/jobson).

[Jobson](https://github.com/adamkewley/jobson) lets developers share
command-line applications over the web without modification. It does
so by providing an abstraction layer over process forking, HTTP API
generation, standard IO, and websockets.

This project is a web-frontend that uses all major features of the
Jobson API. Combined with Jobson, you get a web stack (UI, auth, API,
execution, and persistence) for the price of writing a job spec and
deploying a standard web stack.


# Build

Jobson-UI is built using `node v6.11.4` and `npm 3.10.10`:

```bash
npm install
npm run build
```

Which compiles all outputs to `public/`.


# Using / Deploying

## As a developer/small team

```bash
npm run start
```

This runs a local development webserver + reverse proxy. The reverse
proxy assumes a Jobson server is running on `localhost:8080` (may be
changed in `webpack.config.js`). The development server automatically
recompiles assets as you edit them.

**Note:** This isn't appropriate for a production deployment, but will
get you going quickly.


## In Production:

- When loaded in a browser, clients (i.e. browsers) will send API
  requests to the same server as the UI assets are served from. For
  example, if `index.html` is hosted at `https://domain/index.html`
  then clients will make API calls to `https://domain/api/v1/jobs`. If
  `/api/` is already being used by something else on the same server,
  then build the project with a custom `API_PREFIX`:
  
```bash
npm run build -- --env.API_PREFIX="/customprefix"
```

- Configure your webserver (e.g. Apache or nginx) to
  [reverse proxy](https://www.nginx.com/resources/admin-guide/reverse-proxy/)
  any requests beginning with `/api` (or `API_PREFIX`) to a Jobson
  server. For example, in nginx:
  
```
http {
    server {
        server_name domain;

        location / {
            root /var/www/jobson-ui;
        }

        location /api {
            # A Jobson server running locally on port 8080
            proxy_pass localhost:8080;

            # The Jobson server doesn't use a prefix
            rewrite ^/api/(.*) /$1 break;

            # Websockets
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_read_timeout 86400;
        }
    }
}
```

- Once your webserver is configured, copy the build assets to the
  appropriate folder (e.g. `/var/www/jobson-ui` above)
  
- **DANGER:** The Jobson API can handle client credentials. You must
  configure your webserver to use encryption (SSL/TLS) or you are
  heavily risking risk man-in-the-middle attacks.


