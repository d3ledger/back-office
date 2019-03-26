#!/bin/bash
##
## Copyright D3 Ledger, Inc. All Rights Reserved. SPDX-License-Identifier: Apache-2.0##

printf 'Waiting for back-office backend-server become ready'
until $(curl --output /dev/null -m 5 --silent --head --fail http://localhost:8080); do
    printf '.'
    sleep 5
done
