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

const commands = [
  {
    name: "diwali-on",
    description: "KRS Room Lights On ", 
  },
  {
    name: "diwali-off",
    description: "KRS Room Lights On ", 
  },
  {
    name: "on",
    description: "KRS Room Lights On ",
    options: [
      {
        name: "light_no",
        description: "Which Light?",
        type: 4,
        required: true,
        choices: [
          {
            name: "Light-1",
            value: 1,
          },
          {
            name: "Light-2",
            value: 2,
          },
          {
            name: "Light-3",
            value: 3,
          },
          {
            name: "Light-4",
            value: 4,
          },
        ],
      },
    ],
  },
  {
    name: "off",
    description: "KRS Room Lights Off",
    options: [
      {
        name: "light_no",
        description: "Which Light?",
        type: 4,
        required: true,
        choices: [
          {
            name: "Light-1",
            value: 1,
          },
          {
            name: "Light-2",
            value: 2,
          },
          {
            name: "Light-3",
            value: 3,
          },
          {
            name: "Light-4",
            value: 4,
          },
        ],
      },
    ]
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
  process.env.TOKEN
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
     
    if (interaction.commandName === "diwali-on") {
      console.log(store.get("diwalistatus"));
      if (store.get("diwalistatus")== 1) {
        await interaction.reply(`Already celebrating diwali`);
      } else {
        console.log("was", store.get("acstatus"));
        store.set("diwalistatus", 1);
        await interaction.reply(`Diwali has come lets celebrate !!`);
      }
    }
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
      const num = interaction.options.get("light_no").value;
      console.log(store.get("lightstatus"));
      if (store.get("lightstatus")[num - 1] == 1) {
        await interaction.reply(`Light-${num} already on`);
      } else {
        console.log("was", store.get("lightstatus"));
        var curr = store.get("lightstatus");
        curr[num - 1] = 1;
        store.set("lightstatus", curr);
        await interaction.reply(`Light${num} is on!`);
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
        await interaction.reply(`AC${num} is off!`);
      }
    }
    if (interaction.commandName === "off") {
      const num = interaction.options.get("light_no").value;
      if (store.get("lightstatus")[num - 1] == 0) {
        await interaction.reply(`Light-${num} already off`);
      } else {
        console.log("was", store.get("lightstatus"));
        var curr = store.get("lightstatus");
        curr[num - 1] = 0;
        store.set("lightstatus", curr);
        await interaction.reply(`Light-${num} is off!`);
      }
    }
    if (interaction.commandName === "diwali-off") {
      if (store.get("diwalistatus") == 0) {
        await interaction.reply(`Dieali has already ended`);
      } else {
        console.log("was", store.get("diwalistatus"));

        store.set("diwalistatus", 0);
        await interaction.reply(`it was a joyfull Diwali .. see you next time `);
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
  process.env.TOKEN
);
