# The Detailers Edge

## Setting Up

- install node.js -> should include npm but if necessary install it 
- check node version using the following command -> node -v 
- current node version -> v22.13.1
- after cloning the repo run this command -> npm create vite@latest .
- select react and javascript
- after successfully creating the react + vite app -> npm install
- if necessary -> npm fund
- npm install firebase
- npm install -g firebase-tools
- npm i react-router-dom --save styled-components

## Running the development application 
- npm run dev 

## Deploying to Firebase Hosting
When you're ready, deploy your web app
Put your static files (e.g., HTML, CSS, JS) in your app's deploy directory (the default is "public"). Then, run this command from your app's root directory:

- firebase login
- firebase init
- firebase deploy