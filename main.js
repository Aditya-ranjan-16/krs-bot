const { REST, Routes } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const KeepAlive=require("./server")
const dotenv = require("dotenv");
dotenv.config()
const store = require('data-store')({ path: process.cwd() + '/foo.json' });
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
store.set('lightstatus', 'false'); 

const commands = [
  {
    name: 'on',
    description: 'Replies with Pong!',
  },
  {
    name: 'off',
    description: 'Replies with Pong!',
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
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'on') {
       
        if(store.get("lightstatus")=="true"){

            await interaction.reply('already on');
        }
        else{
            store.set('lightstatus', 'true'); 
            await interaction.reply('lights are on!');
        }
     
    }
    if (interaction.commandName === 'off') {
        if(store.get("lightstatus")=="false"){
            await interaction.reply('already off');
        }
        else{
            store.set('lightstatus', 'false'); 
            await interaction.reply('lights are off!');
        }
     
    }
  });
  KeepAlive()
  client.login("MTAzMjU1NzgyODI4NTY2MTIxNA.GHsBX5.vm3a4vh4vC6ZIHxCzyVsB8BpFGOR2QVN3PkoC4");
