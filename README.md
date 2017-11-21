# Jobson UI
Jobson UI is a set of static web assets that act as a frontend to 
[Jobson](https://github.com/adamkewley/jobson).


## Features

- Exercises all major features of the [Jobson](https://github.com/adamkewley/jobson) 
  HTTP and websockets API
- Automatically generates a job submission form from [Jobson](https://github.com/adamkewley/jobson) 
  job specs
- Dynamically shows job progress
- Searchable job list with basic actions (view, abort, etc.)
- Job details page, showing all outputs and events from a job in realtime
- Can be hosted on standard webservers such as Apache/Nginx with no additional 
  dependencies (apart from Jobson, of course)
 
Screencast:

[![Jobson Screencast](https://img.youtube.com/vi/W9yfpqWiyUg/0.jpg)](https://www.youtube.com/watch?v=W9yfpqWiyUg)


# Install (nginx)
This guide uses [nginx](https://www.nginx.com/) to host the assets and forward
API requests to a Jobson server. **DANGER**: This installation method does not
setup encryption for you. You **NEED** encryption if you are hosting Jobson 
server over an insecure network (e.g. the internet). This is true of almost every
webapp. See [Certbot](https://certbot.eff.org/all-instructions/) for examples 
of how to do this for free.

- Download a [release](https://github.com/adamkewley/jobson-ui/releases) of the assets
- Unzip the assets into a location where you host web assets (this guide 
  assumes `/var/www/jobson-ui`)
- Install [nginx](https://www.nginx.com/). For example, on debian:

```bash
sudo apt-get install nginx
```

- Create an nginx virtual host by creating a file at `/etc/nginx/sites-available/jobson-ui`.
  Paste the following into that file:
 
```
server {
	listen 8090;
	listen [::]:8090;
	
	root /var/www/jobson-ui;
		
	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ =404;
	}

	location /api {
		# Any requests beginning with /api should be forwarded
		# to Jobson
		proxy_pass http://localhost:8080;

		# The Jobson server itself doesn't take an /api prefix
		# (it's just used for routing), so drop it.
		rewrite ^/api/(.*) /$1 break;

		# Enable websockets, which are used for dynamic updates
		# (Jobson UI doesn't *require* them though).
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_read_timeout 86400;
	}
}
```

- Change the `listen` command(s) to whichever port you want the UI to be hosted on
- Change the `root` command to wherever you put the assets
- Change the `proxy_pass` to wherever you are hosting a [Jobson](https://github.com/adamkewley/jobson) 
  server (`localhost:8080` is the default)
- Enable the site by adding a soft link in `/etc/nginx/sites-enabled`. For example:
 
```bash
cd /etc/nginx/sites-enabled
ln -s ../sites-available/jobson-ui jobson-ui
```
 
 - Tell nginx to reload the config:
 
```
nginx -s reload
```

- You're done - you should now be able to load the UI in a browser
 
 
# (Optional) Configure Paths

When loaded in a browser, clients (i.e. browsers) will send API requests 
to the same server as the UI assets are served from. For example, if 
`index.html` is hosted at `https://domain/index.html` then clients will 
make API calls to `https://domain/api/v1/jobs`. If `/api/` is already 
being used by something else on the same server (e.g. when are using a single
webserver to host *many* applications), then build the project from source with 
a custom `API_PREFIX`:
  
```bash
npm install
npm run build -- --env.API_PREFIX="/customprefix"
```

# Build

Jobson UI is built using `node` (at least `v6.11.4`) and `npm`. From
the project folder:

```bash
npm install
npm run build
```

Which compiles all outputs to `public/`.


# Develop

Development of Jobson UI is done using a dynamic development server that
reloads assets as they change. To run that server from the source code:

```bash
npm install
npm run start
```

Which will run a local development webserver + reverse proxy. The reverse
proxy assumes a Jobson server is running on `localhost:8080` (this location 
may be changed in `webpack.config.js`). The development server automatically
recompiles assets as you edit them.

**Note:** This isn't appropriate for a production deployment. You should **always**
use a production-grade webserver such as [nginx](https://www.nginx.com/) or 
[Apache](https://httpd.apache.org/) in production because those webservers are: a) 
very efficient and b) have appropriate modules for encryption, enterprise logins, etc.
