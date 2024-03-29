# Messenger + Telegram bot with AI

## Installation

```sh
mkdir downloads

# Install ffmpeg package
# Windows
choco install ffmpeg
# Ubuntu
sudo apt install ffmpeg

cp .env.example .env
# Edit .env

yarn

yarn run start
```

### Telegram commands

```text
ai - My assistant
apps - Show all apps
chat - ChatGPT bot
new - New conversation
new_char - New conversation with current character
imagine - Create image using Dall-E 2
speak - Text to speech
save - Save conversation
settings - Settings
debug - Debug
help - How to use this bot?
```

## Changelog

24/3

- Add Telegram bot with ChatGPT

28/3

- Add voice chat to Telegram bot

8/4

- Update Apps + Settings - easier to config

## Configuration

### The `bottender.config.js` File

Bottender configuration file. You can use this file to provide settings for the session store and channels.

### The `.env` File

Bottender utilizes the [dotenv](https://www.npmjs.com/package/dotenv) package to load your environment variables when developing your app.

To make the bot work, you must put required environment variables into your `.env` file.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode.<br>
The bot will automatically reload if you make changes to the code.<br>
By default, server runs on [http://localhost:5000](http://localhost:5000) and ngrok runs on [http://localhost:4040](http://localhost:4040).

To run in [Console Mode](https://bottender.js.org/docs/en/the-basics-console-mode), provide the `--console` option:

```sh
npm run dev -- --console
yarn dev --console
```

### `npm start`

Runs the app in production mode.<br>
By default, server runs on [http://localhost:5000](http://localhost:5000).

To run in [Console Mode](https://bottender.js.org/docs/en/the-basics-console-mode), provide the `--console` option:

```sh
npm start -- --console
yarn start --console
```

### `npm run lint`

Runs the linter rules using [Eslint](https://eslint.org/).

### `npm test`

Runs the test cases using [Jest](https://jestjs.io/).

## Learn More

To learn Bottender, check out the [Bottender documentation](https://bottender.js.org/docs/en/getting-started).

For more examples, see [Bottender examples](https://github.com/Yoctol/bottender/tree/master/examples).
