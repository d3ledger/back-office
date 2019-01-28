#!/bin/bash
cd /app
yarn
yarn build

printf 'Waiting for iroha and grpc-server become ready'
while [[ "$(curl -s -o /dev/null -m 5 -w ''%{http_code}'' grpcwebproxy:8081)" != "500" ]]; do 
  printf '.';
  sleep 5; 
done

NODE_IP=http://iroha:50051 DEBUG=iroha-util node scripts/setup.js
http-server --cors ./dist
