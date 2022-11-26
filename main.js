const { REST, Routes } = require("discord.js");
const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
dotenv.config();
const store = require("data-store")({ path: process.cwd() + "/foo.json" });
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const port = process.env.PORT || 5000;
const app = express();
app.use(bodyParser.json());
store.set("lightstatus", 0);
store.set("acstatus", [0, 0, 0, 0]);

const commands = [
  {
    name: "on",
    description: "KRS Room Lights On ",
  },
  {
    name: "off",
    description: "KRS Room Lights Off",
  },
  {
    name: "ac-on",
    description: "KRS Room AC On",
    options: [
      {
        name: "number",
        description: "Which ac?",
        type: 4,
        required: true,
        choices: [
          {
            name: "AC1",
            value: 1,
          },
          {
            name: "AC2",
            value: 2,
          },
          {
            name: "AC3",
            value: 3,
          },
          {
            name: "AC4",
            value: 4,
          },
        ],
      },
    ],
  },
  {
    name: "ac-off",
    description: "KRS Room AC OFF",
    options: [
      {
        name: "number",
        description: "Which ac?",
        type: 4,
        required: true,
        choices: [
          {
            name: "AC1",
            value: 1,
          },
          {
            name: "AC2",
            value: 2,
          },
          {
            name: "AC3",
            value: 3,
          },
          {
            name: "AC4",
            value: 4,
          },
        ],
      },
    ],
  },
];


const rest = new REST({ version: "10" }).setToken(
  "MTAzMjU1NzgyODI4NTY2MTIxNA.GHsBX5.vm3a4vh4vC6ZIHxCzyVsB8BpFGOR2QVN3PkoC4"
);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands("1032557828285661214"), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ac-on") {
      const num = interaction.options.get("number").value;
      console.log(store.get("acstatus"));
      if (store.get("acstatus")[num - 1] == 1) {
        await interaction.reply(`Ac${num} already on`);
      } else {
        console.log("was", store.get("acstatus"));
        var curr = store.get("acstatus");
        curr[num - 1] = 1;
        store.set("acstatus", curr);
        await interaction.reply(`Ac${num} is on!`);
      }
    }
    if (interaction.commandName === "on") {
      console.log(store.get("lightstatus"));
      if (store.get("lightstatus") == 1) {
        await interaction.reply("already on");
      } else {
        console.log("was", store.get("lightstatus"));
        store.set("lightstatus", 1);
        await interaction.reply("lights are on!");
      }
    }
    if (interaction.commandName === "ac-off") {
      const num = interaction.options.get("number").value;
      if (store.get("acstatus")[num - 1] == 0) {
        await interaction.reply(`Ac${num} already off`);
      } else {
        console.log("was", store.get("acstatus"));
        var curr = store.get("acstatus");
        curr[num - 1] = 0;
        store.set("acstatus", curr);
        await interaction.reply(`AC${num} are off!`);
      }
    }
    if (interaction.commandName === "off") {
      if (store.get("lightstatus") == 0) {
        await interaction.reply("Light already off");
      } else {
        console.log("was", store.get("lightstatus"));
        store.set("lightstatus", 0);
        console.log("is", store.get("lightstatus"));
        await interaction.reply("Light are off!");
      }
    }
  } catch (e) {
    console.log(e);
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
  console.log(store.get());
  try {
    res.json(store.get());
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

KeepAlive();
client.login(
  "MTAzMjU1NzgyODI4NTY2MTIxNA.GHsBX5.vm3a4vh4vC6ZIHxCzyVsB8BpFGOR2QVN3PkoC4"
);
