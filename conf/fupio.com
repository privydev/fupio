
server {
   server_name  www.fupio.com;
    rewrite ^(.*) http://fupio.com$1 permanent;
}

# server {
#     listen 443 ssl;

#     server_name fupio.com www.fupio.com;

#     ssl_certificate /etc/letsencrypt/live/fupio.com/cert.pem;
#     ssl_certificate_key /etc/letsencrypt/live/fupio.com/privkey.pem;

#     return 301 http://$http_host$request_uri;
# }

server {

    listen   80;
    server_name beta.fupio.com fupio.com;

    client_max_body_size 5m;
    add_header Access-Control-Allow-Origin *;

    location ~ \.(aspx|php|jsp|cgi|py)$ {
        return 410;
    }

    # location /cache.manifest {
    #     rewrite (.*) /static/cache.manifest;
    # }
    
    # location /favicon.ico {
    #     rewrite (.*) /static/favicon.ico;
    # }
       
    # location = /robots.txt {
    #         rewrite (.*) /static/robots.txt;
    # }

    # location = /opensearch.xml {
    #         default_type application/xml;
    #         rewrite (.*) /static/opensearch.xml;
    # }

    if ($http_user_agent ~* "Windows 95|wget|curl|libwww-perl|HTTrack" ) {
        return 403;
    }

    # location ~*  \.(jpg|jpeg|png|gif|ico|css|js|pdf)$ {
    #    expires 365d;
    # }

    # location ~* \.(eot|ttf|woff)$ {
    #   add_header Access-Control-Allow-Origin *;
    # }

    location / {
        root /var/www/fupio/;
        try_files $uri /index.html;
        http2_push /styles.css;
        http2_push /bundle.js;
        http2_push /icon-192x192.png;
        http2_push /manifest.json;
    }

    

    access_log /var/www/log/nginx-access.log;
    error_log /var/www/log/nginx-error.log;


    # Error pages
    # error_page 500 502 503 504 /500.html;
    # location = /500.html {
    #     root /webapps/fupio/templates/;
    # }
    error_page 500 502 503 504 /index.html;
}



