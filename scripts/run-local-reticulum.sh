#!/usr/bin/env bash
NODE_TLS_REJECT_UNAUTHORIZED=0 ROUTER_BASE_PATH=/spoke BASE_ASSETS_PATH=https://meta2.teacherville.co.kr:9090/ HUBS_SERVER=meta2.teacherville.co.kr RETICULUM_SERVER=meta2.teacherville.co.kr yarn start
