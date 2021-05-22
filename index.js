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
  console.log(`Logged in as ${client.user.tag}!`);
});

d = {"alappuzha":301,"ernakulam":307,"idukki":306,"kannur":297,"kasargod":295,
"kollam":298,"kottayam":304,"kozhikode":305,"malappuram":302,"palakkad":308,
"pathanamthitta":300,"thiruvananthapuram":296,"thrissur":303,"wayanad":299,"east sikkim":535,
"north sikkim":537,"south sikkim":538,"west sikkim":536,"north goa":151,"south goa":152}

function getSessionByDisAge(district,age){
  did=d[district]
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
    let ageGroup = (age>=18 && age<45)?"18":"45";

    if(data.sessions.length==0){
      return `No sessions available`;
    }
    else{

      for (var i=0;i<data.sessions.length;i++){
        if(data.sessions[i].min_age_limit === ageGroup && data.sessions[i].available_capacity > 0){
          temp = `🏥: ${data.sessions[i].name}, 💉: ${data.sessions[i].available_capacity}, 🕰️: ${data.sessions[i].slots} \n`;
          session = session.concat(temp)
        }
      }
    return session
    }
    
  
  })
  .catch((err) => console.log(err));
}

function getSessionByDis(district){
  did=d[district]
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
    if(data.sessions.length==0){
      return `No sessions available`;
    }
    else{
      var ss=``
      for (var i=0;i<data.sessions.length;i++){
        if(data.sessions[i].available_capacity > 0){     
          t=`🏥 :${data.sessions[i].name}, 💉: ${data.sessions[i].available_capacity}, 🕰️: ${data.sessions[i].slots} \n`;
          ss = ss.concat(t)
        }
      }
      return ss
    }
  })
  .catch((err) => console.log(err));
}

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.author.send('Pong!');
  }

  if (msg.content.startsWith("/pin")){
    pin = msg.content.split("/pin ")[1]
    getSessionByPin(pin).then(session=>{
      const embed = new Discord.MessageEmbed()
            .setTitle(`Session - ${pin}`)
            .setColor(0xff0000)
            .setDescription(session);
          msg.channel.send(embed);
    })
  }
  if(msg.content.startsWith("/dis")){
    district = msg.content.split("/dis ")[1]
    getSessionByDis(district.toLowerCase()).then(session =>{
      if(!session){
        const embed = new Discord.MessageEmbed()
            .setTitle(`Session - ${district.toUpperCase()}`)
            .setColor(0xff2000)
            .setDescription("No Session Available");
          msg.channel.send(embed);
      }
      else{
        const embed = new Discord.MessageEmbed()
            .setTitle(`${district}`)
            .setColor(0xff0000)
            .setDescription(session);
          msg.channel.send(embed);
      } 
    })
    
  }
  if (msg.content.startsWith("/register")) {
    let dis = msg.content.split("/register ")[1];
    let id = msg.author.id;
    helpers.saveDist(id,dis.toLowerCase()).then((data)=> {
      if(data) msg.reply('Already registered, please use /update command to update')
    })
  }

  if(msg.content.startsWith("/update")){
    let id = msg.author.id;
    let dis = msg.content.split("/update ")[1];
    helpers.check(id).then((data)=>{
      if(data){
        helpers.update(id, dis.toLowerCase())
      }
      else{
        msg.reply('Please register first')
      }
    })
  }
  // if (msg.content.startsWith("/reg_age")) {
  //   let age = msg.content.split("/reg_age ")[1];
  //   let id = msg.author.id
  //   helpers.saveAge(id,age)
  // }
  
  if(msg.content.startsWith("/check")){
    let age = msg.content.split("/check ")[1];
    if(age<18) msg.reply("Currently no vaccination available for below 18")
    else{
      let id=msg.author.id;
      helpers.getData(id).then((data)=>{
      getSessionByDisAge(data.district.toLowerCase(), age).then(session=>{
        a = age>=18 && age< 45 ? "18+":"45+" 
        if(!session){
          const embed = new Discord.MessageEmbed()
              .setTitle(`${data.district.toUpperCase()}  ${a}`)
              .setColor(0xff2000)
              .setDescription("No Session Available");
            msg.channel.send(embed);
        }
        else{
          const embed = new Discord.MessageEmbed()
              .setTitle(`${data.district.toUpperCase()}  ${a}`)
              .setColor(0xff0000)
              .setDescription(session);
            msg.channel.send(embed);
        } 
      })
    })
    }
  }

  if(msg.content === '/get_updates'){
    let id = msg.author.id;
    helpers.check(id).then((flag)=>{
      if(flag){
        helpers.getData(id).then((userData)=>{
          let dis = userData.district;
          cron.scheduleJob('0 * * * *', function(){
            getSessionByDis(dis).then(session => {
              console.log('This runs at the 30th mintue of every hour.');
            })
          }); 
        })
        
      }
      else{
        msg.reply("Please register to get updates")
      }
    })
    
  }

  if(msg.content === '/help'){
    const embed = new Discord.MessageEmbed()
            .setTitle('Available Commands')
            .setColor(0xff0000)
            .setDescription(`
            **/help** - Display the help menu
            **/reg_dis <DISTRICT>** - Register district with the bot
            **/reg_age <AGE>** - Register age with the bot
            **/check** - Check the available session using registered details
            **/pin <Pincode>**  - Check available sessions using Pincode 
            **/dis <District>** - Check available sessions in your district
            `);
          msg.channel.send(embed);
  }

  client.user.setPresence({
    activity:{
      name: `"/help" for help menu`
    }
  })

});

client.login(process.env.TOKEN);






