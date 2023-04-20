import * as dotenv from 'dotenv'
import { Client, IntentsBitField } from 'discord.js'
import axios from "axios"

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
    description: "Provide a joke",
    defaultPermission: false,
  })
  console.log(`Created command ${command.name}`)
})

export const handleInteraction = async (interaction) => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === "joke") {
    const joke = await getRandomJoke()
    await interaction.reply({
      content: joke,
      ephemeral: true,
    })
  }
}

client.on("interactionCreate", handleInteraction)


async function getRandomJoke() {
  try {
    const { data } = await axios.get('https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit')
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

