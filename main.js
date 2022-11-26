const { REST, Routes } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
dotenv.config()
const store = require('data-store')({ path: process.cwd() + '/foo.json' });
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());
store.set('lightstatus', '0'); 

const commands = [
  {
    name: 'on',
    description: 'KRS Room Lights On ',
  },
  {
    name: 'off',
    description: 'KRS Room Lights Off',
  },
  {
    name: 'ac on',
    description: 'KRS Room AC On',
  },
  {
    name: 'ac off',
    description: 'KRS Room AC OFF',
  },
];

const rest = new REST({ version: '10' }).setToken("MTAzMjU1NzgyODI4NTY2MTIxNA.GHsBX5.vm3a4vh4vC6ZIHxCzyVsB8BpFGOR2QVN3PkoC4");

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands("1032557828285661214"), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });
  
  client.on('interactionCreate', async interaction => {
    try{
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'on') {
      console.log(store.get("lightstatus"))
        if(store.get("lightstatus")=="1"){

            await interaction.reply('already on');
        }
        else{
          console.log("was",store.get("lightstatus"))
            store.set('lightstatus', '1'); 
            await interaction.reply('lights are on!');
        }
     
    }
    if (interaction.commandName === 'on') {
      console.log(store.get("lightstatus"))
        if(store.get("lightstatus")=="1"){

            await interaction.reply('already on');
        }
        else{
          console.log("was",store.get("lightstatus"))
            store.set('lightstatus', '1'); 
            await interaction.reply('lights are on!');
        }
     
    }
    if (interaction.commandName === 'off') {
     
        if(store.get("lightstatus")=="0"){
            await interaction.reply('already off');
        }
        else{
          console.log("was",store.get("lightstatus"))
            store.set('lightstatus', '0'); 
            await interaction.reply('lights are off!');
        }
     
    }
  }catch(e){
    console.log(e)
  }
  });
  //**************************SERVER**************************** */
  app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE,OPTIONS"
  );

  next();
});

app.get("/status", (req, res) => {
    console.log(store.get())
  try {
     res.json(store.get())
  } catch (e) {
    console.log(e);
  }
});
function KeepAlive() {
  app.listen(port, () => {
    console.log("Listining on port " + port);
    console.log("connected");
  });
}

  KeepAlive()
  client.login("MTAzMjU1NzgyODI4NTY2MTIxNA.GHsBX5.vm3a4vh4vC6ZIHxCzyVsB8BpFGOR2QVN3PkoC4");
