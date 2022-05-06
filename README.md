# BNF link checker

> Small utility to check links from the current live BNF site agains the new Gatsby BNF

## Usage

Install Volta to manage Node versions if you don't already have it. Using Volta will automatically use the correct Node version based on package.json.
If you're not using Volta, then use Node 18. Node 18 is needed as we're using fetch and top level await.

Install dependencies via `npm i` on the command line.

Change any values inside _settings.json_ for the sites to point at.

Run `npm start` and you should see a table outputted on the console.


