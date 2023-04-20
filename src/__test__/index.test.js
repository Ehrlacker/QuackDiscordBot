import axios from "axios"
import { handleInteraction } from "../index"

jest.mock('axios');

const mock_joke_success = {
    error: false,
    setup: "why do python programmers wear glasses?",
    delivery: "Because they can't C.",
}

const mock_joke_success_single = {
    error: false,
    joke: "This is the text of the single line joke",
}

const mock_joke_failure = {
    "error": true
}

const interaction = {
    commandName: 'joke',
    isCommand: jest.fn().mockReturnValue(true),
    reply: jest.fn()
}

const notInteraction = {
    commandName: 'joke',
    isCommand: jest.fn().mockReturnValue(false),
    reply: jest.fn()
}

describe('Discord Joke Bot', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should reply with a setup and delivery if recieved when the joke command is entered', async () => {
        axios.get.mockResolvedValue({
            data: { ...mock_joke_success }
        })
        await handleInteraction(interaction)
        expect(interaction.reply).toHaveBeenCalledWith({
            ephemeral: true,
            content: "why do python programmers wear glasses? Because they can't C."
        })
    })

    it('should reply with the single line joke if recieved when the joke command is entered', async () => {
        axios.get.mockResolvedValue({
            data: { ...mock_joke_success_single }
        })
        await handleInteraction(interaction)
        expect(interaction.reply).toHaveBeenCalledWith({
            ephemeral: true,
            content: "This is the text of the single line joke"
        })
    })

    it('should reply with an error if the api provides an error state', async () => {
        axios.get.mockResolvedValue({
            data: { ...mock_joke_failure }
        })
        await handleInteraction(interaction)
        expect(interaction.reply).toHaveBeenCalledWith({ "content": "Unexpected error", "ephemeral": true })
    })

    it('should not call reply if not a command', async () => {
        axios.get.mockResolvedValue({
            data: { ...mock_joke_success }
        })
        await handleInteraction(notInteraction)
        expect(interaction.reply).not.toHaveBeenCalled()
    })
})