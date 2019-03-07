###Summary of stack:
- AngularJS for frontend
- NodeJS for backend with the ExpressJS framework
- MongoDB for database, hosted on Mongo Atlas
- Entire frontend deployed as a static website via AWS S3
- Backend deployed on a private Ubuntu VPS via Nginx

###Project structure:
- The frontend and backend were developed as two separate repos, but have been combined for convenience
- The backend lies in `/shortform-demo-api`:
    - `/server.js` serves as the entry point
    - Within `/app` folder:
        `/models/Word.js`: defines the schema (data structure) for the words
        `/controllers/WordCtrl.js`: CRUD functions for modifying the words database
        `/routes/wordRoutes.js`: maps out the API endpoints that are made available to the frontend and calls the respective CRUD functions in `WordCtrl.js`
- The frontend lies in `/shortform-demo`:
    - `/public contains` the main source code:
        - `/views/*.html`: the views for the SPA
        - `/js/controllers/PlayCtrl.js`: Manages the interactions on the Play tab. Responsible for retrieving next available word and calculating time til next review
        - `/js/controllers/SettingsCtrl.js`: Manages the interactions on the Settings tab. Responsible for creating new words and retrieving details of each word in database
        - `/js/services/Words.js`: CRUD helper functions to interface with the API endpoints

    - `/scss` contains the source code for styling which gets generated into raw CSS in `/public/css`
    - Prior to deploying to production, the source code is bundled up and compressed. The result is outputted into the `/dist` directory which is then uploaded to S3
