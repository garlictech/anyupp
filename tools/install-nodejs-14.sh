#!/bin/bash

version='v14.16.1'
distro='linux-x64'
package_name="node-$version-$distro"
package_location="/usr/local/lib/"

curl -O https://nodejs.org/download/release/$version/$package_name.tar.gz
tar -xvf $package_name.tar.gz -C $package_location
rm -rfv $package_name.tar.gz

echo "export PATH=$package_location/$package_name/bin:\$PATH" >> ~/.profile
