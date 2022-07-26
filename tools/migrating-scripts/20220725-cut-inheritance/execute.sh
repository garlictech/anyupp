#!/bin/bash
set -e
IFS='|'

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Create geoindex in unit table and migrate the unit fields
yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register \
  ${SCRIPT_DIR}/script.ts
