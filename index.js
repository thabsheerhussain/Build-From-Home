const axios = require('axios');
const Discord = require('discord.js');
const https = require('https');
const fetch = require('node-fetch');
const client = new Discord.Client();
require('dotenv').config()
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function getSessionByPin(){
  axios.get('https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=577&date=19-05-2021',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0',
      },
    },
  )
  .then(({ data }) => console.log(data))
  .catch((err) => console.log(err));
}

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }

  if (msg.content.startsWith("$pin")){
    getSessionByPin();
    // pin=msg.content.split("$pin ")[1]
    // getSessionByPin(pin).then(session=>{msg.reply(session)})
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