#! /bin/bash

NAME=$1
NAME_LOWERCASE=$1


FILE_PATH=$(cd "$(dirname "${BASH_SOURCE[0]}")/../src" && pwd)

re="[[:space:]]+"

if [ "$#" -ne 1 ] || [[ $NAME =~ $re ]] || [ "$NAME" == "" ]; then
  echo "Usage: pnpm gc \${name} with no space"
  exit 1
fi

DIRNAME="$FILE_PATH/views/$NAME"
# FILE_INDEX="$FILE_PATH/views/index.ts"
INPUT_NAME=$NAME

if [ -d "$DIRNAME" ]; then
  echo "$NAME component already exists, please change it"
  exit 1
fi

NORMALIZED_NAME=""
for i in $(echo $NAME | sed 's/[_|-]\([a-z]\)/\ \1/;s/^\([a-z]\)/\ \1/'); do
  C=$(echo "${i:0:1}" | tr "[:lower:]" "[:upper:]")
  NORMALIZED_NAME="$NORMALIZED_NAME${C}${i:1}"
done
NAME=$NORMALIZED_NAME

mkdir -p "$DIRNAME"
touch "$DIRNAME/index.vue"

cat > $DIRNAME/index.vue <<EOF
<template>
  <div></div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
EOF

