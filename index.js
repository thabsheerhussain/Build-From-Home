const axios = require('axios');
const Discord = require('discord.js');
const https = require('https');
const fetch = require('node-fetch');
const client = new Discord.Client();

require('dotenv').config()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

d = {"Alappuzha":301,"Ernakulam":307,"Idukki":306,"Kannur":297,"Kasaragod":295,
"Kollam":298,"Kottayam":304,"Kozhikode":305,"Malappuram":302,"Palakkad":308,
"Pathanamthitta":300,"Thiruvananthapuram":296,"Thrissur":303,"Wayanad":299,"East Sikkim":535,
"North Sikkim":537,"South Sikkim":538,"West Sikkim":536,"North Goa":151,"South Goa":152}

function getSessionByDis(district){
  did=d[district]
  url='https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id='+did+'&date=20-05-2021'
  return axios.get(url,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
      },
    },
  )
  .then(({ data }) =>{
    //console.log(data.sessions.length);
    var session={}
    
    for (var i=0;i<data.sessions.length;i++){
      if(data.sessions[i].available_capacity > 0){
        session[i] = {"Available slotname":data.sessions[i].name,"Capacity":data.sessions[i].available_capacity,"Vaccine":data.sessions[i].vaccine,"Slots":data.sessions[i].slots}
        //console.log("Available slot: "+data.sessions[i].name+"\nCapacity: "+data.sessions[i].available_capacity+"\nVaccine:"+data.sessions[i].vaccine)
      }
    }
    return session
  
  })
  .catch((err) => console.log(err));
  //console.log(data.sessions[0].name)
}

function getSessionByPin(pin){
  
  url='https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode='+pin+'&date=20-05-2021'
  return axios.get(url,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
      },
    },
  )
  .then(({ data }) =>{
    //console.log(data.sessions.length);
    if(data.sessions.length==0){
      return "no sessions available";
    }
    else{
      var ss={}
      for (var i=0;i<data.sessions.length;i++){
        if(data.sessions[i].available_capacity > 0){
          // return "Available slot: "+data.sessions[i].name+",Capacity: "+data.sessions[i].available_capacity+"\nVaccine:"+data.sessions[i].vaccine
          //return {"Available slot":data.sessions[i].name,"Capacity":data.sessions[i].available_capacity,"Vaccine":data.sessions[i].vaccine}
          ss[i]={"Available slotname":data.sessions[i].name,"Capacity":data.sessions[i].available_capacity,"Vaccine":data.sessions[i].vaccine,"Slots":data.sessions[i].slots};
          
        }
      }
      //console.log(ss);
      return ss
      
    }
  })
  .catch((err) => console.log(err));
  //console.log(data.sessions[0].name)
  
}

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

  if (msg.content.startsWith("$pin")){
    pin = msg.content.split("$pin ")[1]
    //getSessionByPin(pin);
    // pin=msg.content.split("$pin ")[1]
    getSessionByPin(pin).then(session=>{
      //console.log(Object.keys(session).length);
      for(var j=0;j<Object.keys(session).length;j++){
        msg.reply("Available Sessions for Pin "+pin+"\nName: "+session[j]["Available slotname"]+"\nSlots:"+session[j]['Slots'])
      }
    })
  }
  if(msg.content.startsWith("$dis")){
    district = msg.content.split("$dis ")[1]
    //console.log(d[district]);
    getSessionByDis(district).then(session =>{
      // const embed = new Discord.MessageEmbed()
      // // Set the title of the field
      // .setTitle('Available Sessions')
      // // Set the color of the embed
      // .setColor(0xff0000)
      // // Set the main content of the embed
      // .setDescription(JSON.stringify(session["0"]));
      // msg.channel.send(embed)
      // console.log(session);

      for(var j=0;j<Object.keys(session).length;j++){
        msg.reply("Available Sessions for district "+district+"\nName of centre: "+session[j]["Available slotname"]+"\nSlots:"+session[j]['Slots'])
      }

      
    })
    
}
});

client.login(process.env.TOKEN);






 // fetch('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=512&date=31-03-2021')
  //   .then(res => res.json())
  //   .then(json => console.log(json));

  // https.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=535&date=19-05-2021', (res) => {
	// 	res.on('data', (data) => {
	// 	result=(JSON.parse(data))
  //   console.log(result)
	// 	})
	// })
  
  // axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=577&date=19-05-2021', (res) => {
	// 	res.on('data', (data) => {
	// 		result=(JSON.parse(data))
  //     console.log(result)
	// 	})
	// })


  // url="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=578&date=19-05-2021"
  // return fetch(url).then(res=>{
  //   return res.json()
  // }).then(data=>{return data})