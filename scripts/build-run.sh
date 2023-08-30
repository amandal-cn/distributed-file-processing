# Build and Start API
cd api
npm install
npx tsc
node dist/index.js
cd ..

# Build and Start UI
cd ui
npm install
npm start
cd ..

# Install worker dependencies
cd workers
pip install -r requirements.txt

echo "Open the UI in your browser to process your files!"
