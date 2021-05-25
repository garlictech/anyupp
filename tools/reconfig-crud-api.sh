#!/bin/bash
set -e
IFS='|'

amplify import auth
amplify add api
amplify add codegen
amplify push

