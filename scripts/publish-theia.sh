#!/bin/sh

export THEIA_HOME=$1
echo "Deploying to NPM... using THEIA directory $1"

cd ${THEIA_HOME}/dev-packages
for f in $(find . -name "package.json" -type f -not -path "*node_modules/*"); do
    cd ${THEIA_HOME}/dev-packages/$(dirname $f);
    echo "publishing from $(pwd) the command publish....";
    npm publish --access public;
done;

cd ${THEIA_HOME}/packages
for f in $(find . -name "package.json" -type f -not -path "*node_modules/*"); do
    cd ${THEIA_HOME}/packages/$(dirname $f);
    echo "publishing from $(pwd) the command publish....";
    npm publish --access public;
done;

