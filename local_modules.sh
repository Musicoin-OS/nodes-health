#!/bin/sh
for i in $(find ./local_modules -type d -maxdepth 1) ; do
    packageJson="${i}/package.json"
    if [ -f "${packageJson}" ]; then
        echo "installing ${i}..."
        npm install "${i}"
    fi
done