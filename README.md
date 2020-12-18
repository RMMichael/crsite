# crsite

This project was done from scratch upon proposal, which led to dramatic under-estimation of 
time in which it would be completed. I had to configure and entire database, express.js backend 
and entire frontend from scratch which was very difficult. As a result, I did not complete all the 
tasks I set out to do.

Begin by downloading postgres sql on your machine.  
Run these scripts from the following folders...  

go into the .env file in the root folder and fix the 
DATABASE_URL environment variable to your local postgres url  
note... keep sslmode on disable.   

`cd server`  
`npm run initdb`  
`npm run addData`  
`npm install`  
`npm run dev`

`cd client`  
`npm install`  
`npm run dev`  

at this point you should be able to visit localhost:8080 
in your browser to visit the site. As I said before, the frontend 
I did not have enough time to fully complete, but I hope you 
do understand the amount of time it took to create this project. 
Thanks.

NOTE... if this does not work and a ssl error occurs  
log into the postgres database with psql 
and type in  
`SHOW config_file;`  
this will give you a url to your file. The file 
will need to be modified. Add this to the file.  
`ssl=off`  
this should fix that. I know, its awful
