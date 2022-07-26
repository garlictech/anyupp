#!/bin/bash
set -e
IFS='|'

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

#yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register \
#  ${SCRIPT_DIR}/handle-units.ts

yarn ts-node --project ./tools/tsconfig.json -r tsconfig-paths/register \
  ${SCRIPT_DIR}/handle-products.ts
