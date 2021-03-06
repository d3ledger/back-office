#!/bin/bash
cd /app
yarn
yarn build

printf 'Waiting for iroha and grpc-server become ready'
while [[ "$(curl -s -o /dev/null -m 5 -w ''%{http_code}'' grpcwebproxy:8080)" != "500" ]]; do 
  printf '.';
  sleep 5; 
done

NODE_IP=d3-iroha:50051 DEBUG=iroha-util node scripts/setup.js
# To verify that iroha commit all transactions
sleep 5;
http-server --cors ./dist
