#!/bin/bash
cd /app
yarn

curl -s -o /dev/null -m 10 -I http://grpcwebproxy:8080
sleep 10

NODE_IP=http://grpcwebproxy:8080 DEBUG=iroha-util node scripts/setup.js
yarn serve

# curl -s -o /dev/null -m 30 -I http://localhost:8080


# sleep 30
# CYPRESS_baseUrl=http://localhost:8080 CYPRESS_IROHA=http://grpcwebproxy:8080 cypress -P=/app run