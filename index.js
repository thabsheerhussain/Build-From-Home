const axios = require('axios');
const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('./connection');
const helpers = require('./helpers')
var cron = require('node-schedule');
require('dotenv').config()

db.connect((err)=>{
  if(err)
  console.log("ERROR :"+err);
  else
  console.log("DATABASE CONNECTED");
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  cron.scheduleJob('0 * * * *', async ()=>{
    userList =await helpers.updateList()
    for(i=0;i<userList.length;i++){
     var id = userList[i].discordId
     var district = userList[i].district
     var session = await getSessionByDis(district)
      var user =await client.users.fetch(id)
      if(!session){
        const embed = new Discord.MessageEmbed()
            .setTitle(`${district.toUpperCase()}`)
            .setColor(0xff0000)
            .setDescription("No Session Available")
            .setTimestamp();
          user.send(embed);
      }
      else{
        const embed = new Discord.MessageEmbed()
            .setTitle(`${district.toUpperCase()}`)
            .setColor(0x00ff00)
            .setDescription(session)
            .setTimestamp()
            .setURL("https://www.cowin.gov.in/home")
            .addField("Winning over covid-19","[Book your slots from here](https://www.cowin.gov.in/home)");
          user.send(embed);
      } 
    }
  });   
})


d = {"alappuzha":301,"ernakulam":307,"idukki":306,"kannur":297,"kasargod":295,
"kollam":298,"kottayam":304,"kozhikode":305,"malappuram":302,"palakkad":308,
"pathanamthitta":300,"thiruvananthapuram":296,"thrissur":303,"wayanad":299,"east sikkim":535,
"north sikkim":537,"south sikkim":538,"west sikkim":536,"north goa":151,"south goa":152}

function getSessionByDisAge(did,age){
  
  let date = new Date();
  date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  url='https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='+did+'&date='+date
  return axios.get(url,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
      },
    },
  ) 
  .then(({data} ) =>{
    let session = ``
    let ageGroup = (age>=18 && age<45)?"18":"45";
    for (var i=0;i<data.sessions.length;i++){
      if(data.sessions[i].min_age_limit == ageGroup && data.sessions[i].available_capacity > 0){
        temp = `🏥: ${data.sessions[i].name}, 💉: ${data.sessions[i].available_capacity}, 🕰️: ${data.sessions[i].slots} \n`;
        session = session.concat(temp)
      }
    }
    return session
    
  })
  .catch((err) => console.log(err));
}

function getSessionByDis(did){
  
  let date = new Date();
  date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`

  url='https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='+did+'&date='+date
  return axios.get(url,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
      },
    },
  ) 
  .then(({ data }) =>{
    let session = ``
    
      for (var i=0;i<data.sessions.length;i++){
        if(data.sessions[i].available_capacity > 0){
          temp = `🏥: ${data.sessions[i].name},🧍: ${data.sessions[i].min_age_limit}+, 💉: ${data.sessions[i].available_capacity}, 🕰️: ${data.sessions[i].slots} \n`;
          session = session.concat(temp)
        }
      }

      return session
    
  })
  .catch((err) => console.log(err));
}

function getSessionByPin(pin){
  let date = new Date();
  date = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  url='https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode='+pin+'&date='+date
  return axios.get(url,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
      },
    },
  )
  .then(({ data }) =>{
  if(data){
    var ss=``
    for (var i=0;i<data.sessions.length;i++){
      if(data.sessions[i].available_capacity > 0){     
        t=`🏥: ${data.sessions[i].name}, 💉: ${data.sessions[i].available_capacity}, 🕰️: ${data.sessions[i].slots} \n`;
        ss = ss.concat(t)
      }
    }
    return ss
  }
  else return null
    
  })
  .catch((err) => console.log(err));
}

client.on('message', msg => {

  if (msg.content.startsWith("/pin")){
    pin = msg.content.split("/pin ")[1]
    if(pin.length != 6){
      msg.reply("Please enter a valid Pincode")
    }
    else{
      getSessionByPin(pin).then(session=>{
        if(!session){
          const embed = new Discord.MessageEmbed()
              .setTitle(`Session - ${pin}`)
              .setColor(0xff0000)
              .setDescription("No Session Available");
            msg.channel.send(embed);
        }
        else{
          const embed = new Discord.MessageEmbed()
              .setTitle(`Session - ${pin}`)
              .setColor(0x00ff00)
              .setDescription(session);
            msg.channel.send(embed);
        } 
      })
    }
    
  }
  if(msg.content.startsWith("/dis")){
    district = msg.content.split("/dis ")[1].toLowerCase()
    if(district in d){
      did=d[district]
    getSessionByDis(did).then(session =>{
      if(!session){
        const embed = new Discord.MessageEmbed()
            .setTitle(`Session - ${district.toUpperCase()}`)
            .setColor(0xff0000)
            .setDescription("No Session Available");
          msg.channel.send(embed);
      }
      else{
        const embed = new Discord.MessageEmbed()
            .setTitle(`Session - ${district.toUpperCase()}`)
            .setColor(0x00ff00)
            .setDescription(session);
          msg.channel.send(embed);
      } 
    })
    }else{
      msg.reply(`Sorry, I can't find the entered district.`)
    }
    
  }


  if (msg.content.startsWith("/register")) {
    let dis = msg.content.split("/register ")[1]
    let id = msg.author.id;
    helpers.check(id).then((user)=>{
      if(user){
        msg.reply(`Already registered, please use "/update" command to update`)
      }
      else{
        if(dis in d){
          helpers.saveDist(id, dis.toLowerCase()).then((data)=>{
            if(data){
              msg.reply(`Successfully registered`)
            }
          })
        }
        else{
          msg.reply("Please enter correct District name")
        }
      }
    })
  }

  if(msg.content.startsWith("/update")){
    let id = msg.author.id;
    let dis = msg.content.split("/update ")[1];
    helpers.check(id).then((data)=>{
      if(data){
        if (dis in d){
          helpers.update(id, dis.toLowerCase()).then((data)=>{
            if(data) msg.reply("Data Updated")
          })
        }
        else{
          msg.reply("Please enter correct District name")
        }
      }
      else{
        msg.reply('Please register first')
      }
    })
  }
  
  if(msg.content.startsWith("/check")){
    let id=msg.author.id;
    helpers.check(id).then((data)=>{
      if(data){
        let age = msg.content.split("/check ")[1];
        if(age<18) msg.reply("Currently no vaccination available for below 18")
        else{
          
          helpers.getData(id).then((data)=>{
          getSessionByDisAge(data.district.toLowerCase(), age).then(session=>{
            a = age>=18 && age< 45 ? "18+":"45+" 
            if(!session){
              const embed = new Discord.MessageEmbed()
                  .setTitle(`${data.district.toUpperCase()}  ${a}`)
                  .setColor(0xff0000)
                  .setDescription("No Session Available");
                msg.channel.send(embed);
            }
            else{
              const embed = new Discord.MessageEmbed()
                  .setTitle(`${data.district.toUpperCase()}  ${a}`)
                  .setColor(0x00ff00)
                  .setDescription(session);
                msg.channel.send(embed);
            } 
        })
      })
      }
    }
    else{
      msg.reply('Please register first')
    }
    })
    
  }

  if(msg.content === '/view_details'){
    let id = msg.author.id;
    helpers.check(id).then((user)=>{
      if(!user){
        msg.reply(`Not Registered Yet. Use command "/register" to do so`)
      }
      else{
        helpers.getData(id).then((data)=>{
          msg.reply(`Your registered district is ${data.district}`)
        })
      }
  })}
  
  if(msg.content === '/get_updates'){
    let id = msg.author.id;
    helpers.check(id).then((flag)=>{
      if(flag){
        helpers.getData(id).then((data)=>{
          if(data.updates){
            msg.reply("You have already registered")
          }
          else{
            helpers.register4updates(id).then((res)=>{
              msg.reply("You've been successfully registered for the hourly updates feature. You will receive updates in dm")
            })
          }
        })
      }
      else{
        msg.reply("Please register to get updates")
      }
    })
    
  }

  
  if(msg.content === '/stop_updates'){
    let id = msg.author.id;
    helpers.check(id).then((flag)=>{
      if(flag){
        helpers.getData(id).then((data)=>{
          if(data.updates){
            helpers.stopUpdates(id).then((res)=>{
              msg.reply("You've been successfully unregistered from the hourly updates feature")
            })
          }
          else
          {
            msg.reply("You are not registered for updates")
          }
        })
      }else
      {
        msg.reply("Please register first")
      }
    })

  }
  if(msg.content=== '/dm'){
    msg.author.send(`Hi,This is COWIN HELP BOT at your service\n Use command **"/help"** for HELP menu`)
  }

  if(msg.content === '/help'){
    const embed = new Discord.MessageEmbed()
            .setTitle('Available Commands')
            .setColor(0x00ffff)
            .setDescription(`
            **/help** - Display the help menu
            **/dm** - Direct message with the bot
            **/register <DISTRICT>** - Register district with the bot
            **/check <AGE>** - Specify the age group to get session details of the registered district
            **/update <DISTRICT>** - Update the registered district. You need to register first inorder to use this command
            **/view_details** - View your registered district
            **/pin <Pincode>**  - Check available sessions using Pincode 
            **/dis <District>** - Check available sessions in any district
            **/get_updates** - Get hourly updates with your registered data using this command
            **/stop_updates** - To stop the hourly update feature use this command
            `)
            .addField("COWIN Help Bot"," [Add me to your server!](https://discord.com/oauth2/authorize?client_id=843779646927667230&permissions=0&scope=bot)")
          msg.channel.send(embed);
  }
  
});

client.login(process.env.TOKEN);






