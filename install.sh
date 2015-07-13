echo "Installing required npm modules..."
npm install
echo "Done!"

echo "Installing required ui libraries..."
bower install
echo "Done!"

echo "Building application..."
grunt build
echo "Done!"

node app

