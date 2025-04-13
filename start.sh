#!/bin/bash
export NODE_ENV=production
export PORT=3000
export MONGODB_URI="mongodb+srv://koodemx:MZWy6cQ9F0Ev1f75@cluster0.2xngxy9.mongodb.net/wabutton?retryWrites=true&w=majority&appName=Cluster0"
export JWT_SECRET=$(cat .env | grep JWT_SECRET | cut -d= -f2)

npm install
node server.js
