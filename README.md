# To Run
 - `npm install`
 - `node index.js -p 'com.package.name' -s 'patch' -w '/home/source/package/paths'`

# Publish Packages
If packages are under submodule one can easly publish packages.  
`git submodule foreach 'npm publish ./Assets/ --registry=https://upm.registry.com || :'`
