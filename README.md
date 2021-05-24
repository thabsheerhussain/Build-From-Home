![BFH Banner](https://trello-attachments.s3.amazonaws.com/542e9c6316504d5797afbfb9/542e9c6316504d5797afbfc1/39dee8d993841943b5723510ce663233/Frame_19.png)
# COWIN Help Bot
Cowin Help Bot is a discord bot that will help you to find available vaccine slots. You can add this discord bot to any server. Users can interact with the bot using simple and user friendly commands. Available slots can be manually checked either by using pincode and district.Cowin Help Bot also has a hourly update function that updates you with the available sessions of user registered district.  
## Team members
1. [Deepak B](https://github.com/sbdeepu09) 
2. [Mahima P](https://github.com/mahimaprakash) 
3. [Thabsheer Hussain](https://github.com/thabsheerhussain)
## Team Id
``BFH/recQQ1B2tiiU97r17/2021``
## Link to product walkthrough
https://www.loom.com/share/df2ba727791f4fce9b1bbdb566c7114e
## How it Works ?
1. Add the bot to your server
2. Communicate the bot using commands. Below given are the available commands
    - /help - Display the help menu
    - /dm - Direct message with the bot
    - /register <DISTRICT> - Register district with the bot. Specify the district in place of <DISTRICT>
    - /check <AGE> - Specify an age group to get session details of the registered district. You can give your age as it is
    - /update <DISTRICT> - Update the registered district. You need to register first inorder to use this command
    - /view_details - View your registered district
    - /pin <Pincode>  - Check available sessions using Pincode 
    - /dis <District> - Check available sessions in any district
    - /get_updates - Get hourly updates with your registered data using this command
    - /stop_updates - To stop the hourly update feature use this command
3. You can register your district with our bot. If needed, by using the /get_updates command the bot will provide hourly notifications on the status of the session available. You can also stop this feature using /stop_commands
4. You can also use the bot without registering. Commands like /pin and /dis will help to get session details manually.
    
## Libraries used
axios: ^0.21.1,
discord.js: ^12.5.3,
dotenv: ^9.0.2,
mongoose: ^5.12.10,
node-emoji: ^1.10.0,
node-fetch: ^2.6.1,
node-schedule: ^2.0.0
## How to configure
```
git clone https://github.com/thabsheerhussain/Build-From-Home.git
cd Build-From-Home/
npm install

```
[Add bot to server](https://discord.com/oauth2/authorize?client_id=843779646927667230&permissions=0&scope=bot)
## How to Run
```
npm start

```
### This will do the magic
*If above doesn't work, turn on your internet connection and try since there are many web CDNs that need network connection to fetch data*

