const dotenv = require("dotenv")
const { Client, IntentsBitField } = require("discord.js")
const axios = require("axios")

dotenv.config()

//'client' is our bot
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
})

client.on("ready", (c) => {
  console.log(`Logged in as ${c.user.tag}!`)
})

client.on("ready", async () => {
  const command = await client.application.commands.create({
    name: "joke",
    description: "Provide a coding joke",
    defaultPermission: false,
  })
  console.log(`Created command ${command.name}`)
})

client.on("ready", async () => {
  const command = await client.application.commands.create({
    name: "random",
    description: "Provide a random joke",
    defaultPermission: false,
  })
  console.log(`Created command ${command.name}`)
})

const handleInteraction = async (interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === "joke") {
    const joke = await getRandomJoke(
      "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
    )
    await interaction.reply({
      content: joke,
      ephemeral: true,
    })
  } else if (interaction.commandName === "random") {
    const random = await getRandomJoke(
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit"
    )
    await interaction.reply({
      content: random,
      ephemeral: true,
    })
  }
}

client.on("interactionCreate", handleInteraction)

async function getRandomJoke(api) {
  try {
    const { data } = await axios.get(api)
    if (data.error === true) {
      throw new Error(`Unexpected error`)
    }
    const result = data.joke ? data.joke : `${data.setup} ${data.delivery}`
    return result
  } catch (error) {
    return error.message
  }
}

client.login(process.env.TOKEN)

module.exports = { handleInteraction }
