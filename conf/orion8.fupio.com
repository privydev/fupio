
server {
    listen   80;
    server_name orion8.fupio.com;
    
    location ~ \.(aspx|php|jsp|cgi|py)$ {
            return 410;
    }

    location / {
        proxy_pass http://127.0.0.1:38746;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}


# server {
#     listen 443;

#     # host name to respond to
#     server_name orion8.fupio.com;

#     # your SSL configuration
#     ssl on;
#     ssl_certificate /etc/letsencrypt/live/orion8.fupio.com/cert.pem;
#     ssl_certificate_key /etc/letsencrypt/live/orion8.fupio.com/privkey.pem;

#     ssl_session_timeout 1d;
#     ssl_session_cache shared:SSL:50m;
#     ssl_session_tickets off;
#     ssl_protocols TLSv1.2;

#     ssl_prefer_server_ciphers on;
#     ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
#     ssl_ecdh_curve secp384r1;
#     resolver_timeout 5s;
#     add_header Strict-Transport-Security "max-age=63072000";
#     add_header X-Frame-Options DENY;
#     add_header X-Content-Type-Options nosniff;

#     location / {
#         # switch off logging
#         access_log off;

#         # redirect all HTTP traffic to localhost:8080
#         proxy_pass http://localhost:38746;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header Host $host;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

#         location ~ \.(aspx|php|jsp|cgi|py)$ {
#             return 410;
#         }

#         # WebSocket support (nginx 1.4)
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection "upgrade";
#     }
# }


# map $http_upgrade $connection_upgrade {
#     default upgrade;
#     '' close;
# }

# server {
#     listen 4243 ssl;

#     ssl_prefer_server_ciphers on;
#     ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
#     ssl_ecdh_curve secp384r1;
#     ssl_session_cache shared:SSL:10m;
#     ssl_session_timeout 1h;
#     ssl_session_tickets off;
#     ssl_stapling on;
#     ssl_stapling_verify on;
#     resolver_timeout 5s;
#     add_header Strict-Transport-Security "max-age=63072000";
#     add_header X-Frame-Options DENY;
#     add_header X-Content-Type-Options nosniff;

#     ssl_certificate /etc/letsencrypt/live/orion8.fupio.com/cert.pem;
#     ssl_certificate_key /etc/letsencrypt/live/orion8.fupio.com/privkey.pem;

#     location / {
#         proxy_pass http://127.0.0.1:38746; 
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection $connection_upgrade;
#     }
# }

