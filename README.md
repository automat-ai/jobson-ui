# Jobson UI

Video explanation:

[![Jobson Screencast](https://img.youtube.com/vi/W9yfpqWiyUg/0.jpg)](https://www.youtube.com/watch?v=W9yfpqWiyUg)


## Features

- Exercises all major features of the [Jobson](https://github.com/adamkewley/jobson) 
  API
- In-browser authentication
- Searchable job list
- Job submission form that is automatically generated from 
  [Jobson](https://github.com/adamkewley/jobson) job specs
- View job outputs and events in realtime
- View outputs in the browser


# Build

Jobson-UI was built using `node v6.11.4` and `npm 3.10.10`:

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
            proxy_pass http://localhost:8080;

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


