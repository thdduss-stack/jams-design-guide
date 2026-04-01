#!/bin/bash

STANDALONE_PATH='./.next/standalone'

cp -r public $STANDALONE_PATH
mkdir $STANDALONE_PATH/config
cp -r env $STANDALONE_PATH/config/env
cp -r .next/static $STANDALONE_PATH/.next
mkdir -p $STANDALONE_PATH/scripts
cp -r scripts/prestart $STANDALONE_PATH/scripts

cd $STANDALONE_PATH/scripts/prestart || exit 1
npm install

echo "build success!"

exit 0
