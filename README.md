# Irfan Bot V4

Advanced Facebook Messenger Bot with 65+ API Methods

## Features

- 192+ Commands
- 65+ FCA API Methods
- MQTT Real-time Messaging
- Auto-restart on crash
- Admin/Creator/Group management
- AI Integration (GPT, Image generation)
- Economy system (coins, bank, lottery)
- Fun commands (games, memes)
- Media tools (TikTok, YouTube, Music)

## Quick Start

```bash
# Clone
git clone https://github.com/irfan420x/Irfan-Bot-V4.git

# Install
cd Irfan-Bot-V4
npm install

# Add your Facebook cookies to ncstate.json
# Edit config.json with your settings

# Start bot
npm start
```

## Configuration

Edit `config.json`:
- `prefix`: Command prefix (default: `.`)
- `adminBot`: Your Facebook user ID
- `creator`: Your Facebook user ID

Add your Facebook cookies to `ncstate.json` (array format).

## Commands

| Category | Example Commands |
|----------|-----------------|
| Admin | .bio, .ban, .kick, .setname |
| AI | .gpt, .prompt, .midjourney |
| Economy | .daily, .bank, .lottery |
| Fun | .hack, .kiss, .8ball |
| Media | .tiktok, .youtube, .music |
| Info | .help, .ping, .uptime |

## Tech Stack

- Node.js 20+
- FCA Unofficial (Facebook Chat API)
- MQTT Protocol
- SQLite3
- Canvas

## License

MIT
