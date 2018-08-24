#!/bin/bash
cd /app
yarn

printf 'Waiting for iroha and grpc-server become ready'
until $(curl --output /dev/null -m 5 --silent --head --fail http://grpcwebproxy:8080); do
    printf '.'
    sleep 5
done

NODE_IP=http://grpcwebproxy:8080 DEBUG=iroha-util node scripts/setup.js

yarn serve