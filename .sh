cd admin
rm -rf dist/ && npm run build
cd ../supplier
rm -rf dist/ && npm run build
cd ../webapp
rm -rf dist/ && npm run build
cd ..
pm2 restart pm2.json
# http://16.171.137.96:5173 admin
# http://16.171.137.96:5174 supplier
# http://16.171.137.96:5175 user
