#!/bin/bash

version='v14.16.1'
distro='linux-x64'
package_name="node-$version-$distro"
package_location="/usr/local/lib/"

curl -O https://nodejs.org/download/release/$version/$package_name.tar.gz
tar -xf $package_name.tar.gz -C $package_location
rm -rf $package_name.tar.gz

ln -sf $package_location/$package_name/bin/node `which node`

echo "export PATH=$package_location/$package_name/bin:\$PATH" >> ~/.profile
echo "export PATH=$package_location/$package_name/bin:\$PATH" >> ~/.bashrc
export PATH=$package_location/$package_name/bin:\$PATH
