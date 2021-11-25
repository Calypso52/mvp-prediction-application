# mvp-prediction

## Front-end page startup method

demo video: Front-end page demo11.24.mp4
### 1. start server

Under folder 'test proxy server', run order:

1. Provide authentication credentials to your application code by setting the environment variable to connect bigquery:

   `$env:GOOGLE_APPLICATION_CREDENTIALS="E:\database-bigquery-e39fb5537b71.json"`

2. start server:

   `node server.js`

### 2. start webpage

under folder 'mvp-prediction-frontend' run order:

1. Install modules

   `npm install`

2. start webpage

   `npm start`

![image](https://github.com/Calypso52/mvp-prediction/blob/master/pictures/Front-end%20page%20demo11.13.png)
