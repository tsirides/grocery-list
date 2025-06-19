# Grocery List App

Grocery List is a simple app that let's you add your shopping list and share it with your roommates. You can both add things in your grocery list and cross it off as soon as you pick it up.

It works with Firebase, but if you have the knowledge you can hook it up with any database, works better if it's setup as a realtime dB.

## Setting up

You'll need to setup firebase everything in the code is already setup you only have to have a .env file or if you fork it and deploy it with netlify make sure you set the environment variable to VITE_DATABASE = "Your firebase URL here".

Make sure that you have public rules on with firebase in order for the app to be able to read/write freely and don't share your URL with anyone cause that means they will have access to your dB.
