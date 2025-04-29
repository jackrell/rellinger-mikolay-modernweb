# React + Vite NBA Team Builder App

## Jack Rellinger, Danny Mikolay

### IMPORTANT
### How to Run App + Backend Server Locally
1. Have two terminals open to run our backend and our frontend app (one in project root, one in backend/)
2. In 'backend/' folder, run 
```bash
npm install
node index.js
```
3. In the root directory, run
```bash
npm install
npm run dev
```
4. Have fun creating teams and simulating games!


### Other Notes
Notes on the nba_api python block in backend:
- Tried to use nba_api from github to create a more robust player dataset with historical players
- Encountered multiple issues when using the api repeatedly, resulted in failure after ~ 100 calls
- Tried multiple workarounds, defaulted back to our static original players.json 

### Acknowledgements
Used Vite + React, Tailwind CSS + ChatGPT for some styling