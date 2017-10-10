# Jobson UI

A web frontend for [Jobson](https://github.com/adamkewley/jobson).

[Jobson](https://github.com/adamkewley/jobson) lets developers share
command-line applications over the web without modification. It does
so by providing an abstraction layer over process forking, HTTP API
generation, standard IO, and websockets.

This project is a web-frontend that uses all major features of the
Jobson API. Combined with Jobson, you get a web stack (UI, auth,
API, execution, and persistence) for the price of writing a job spec.

This project was made with [react-webpack-babel](https://github.com/alicoding/react-webpack-babel)
and associated libraries.


# Build

Built using `node v6.11.4` and `npm 3.10.10`:

```bash
npm install
npm run build
```

Which compiles all outputs to `public/`.


# Using / Deploying

## As a developer/small team

```
npm run start
```

This runs a local development server, which assumes a Jobson server
is running on `localhost:8080` (see `webpack.config.js`). The development
server automatically recompiles assets as you edit them.

**Note:** This isn't appropriate for long-term deployments, but will
get you going quickly.


## As a host:

- Build the project
- Host the built assets using a standard webserver (e.g. Apache/Nginx)
- When loaded in a browser, the UI will send API requests to the
  same server it is hosted on. For example, if `index.html` is hosted
  at `http://some-domain.com/index.html` then the frontend will make requests
  to `http://some-domain.com/api/v1/jobs`.
- Your chosen webserver must be configured to [reverse proxy](https://www.nginx.com/resources/admin-guide/reverse-proxy/)
  any requests beginning with `/api/` to a Jobson server. For example, in
  nginx:

```
http {
    server {
        server_name www.some-domain.com;

        location / {
            # From this project
            root /var/www/built-assets;
        }

        location /api {
            # Forward API commands
            proxy_pass localhost:8080;

            # The Jobson server doesn't use the /api/ prefix.
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
