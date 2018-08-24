#!/bin/bash
cd /app
yarn
yarn build

printf 'Waiting for iroha and grpc-server become ready'
while [[ "$(curl -s -o /dev/null -m 5 -w ''%{http_code}'' grpcwebproxy:8080)" != "500" ]]; do 
  printf '.';
  sleep 5; 
done

NODE_IP=http://grpcwebproxy:8080 DEBUG=iroha-util node scripts/setup.js
http-server --cors ./dist
