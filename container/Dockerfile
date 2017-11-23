FROM nginx:1.12-alpine

COPY container/tmp/artifact/ /var/www/jobson-ui
COPY jobson-ui.conf /tmp/

ENV PREFIX= \
    JOBSON_SERVER=localhost:8080

RUN mkdir -p /etc/nginx/sites-available && \
    rm -f /etc/nginx/conf.d/default.conf && \
    ln -s /etc/nginx/sites-available/jobson-ui.conf /etc/nginx/conf.d/jobson-ui.conf


CMD /bin/sh -c 'cat /tmp/jobson-ui.conf | sed "s/PREFIX/${PREFIX}/g" | sed "s/JOBSON_SERVER/${JOBSON_SERVER}/g" > /etc/nginx/sites-available/jobson-ui.conf && nginx -g "daemon off;"'