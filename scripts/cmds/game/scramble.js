/**
 * @file scramble.js
 * @description A live interactive word scramble game for Irfan-bot.
 * @path /home/ubuntu/Irfan-bot/scripts/cmds/game/scramble.js
 */

const axios = require("axios");

module.exports = {
	config: {
		name: "scramble",
		aliases: ["wordgame", "ws"],
		version: "1.1",
		author: "Irfan Ahmmed",
		countDown: 5,
		role: 0,
		description: {
			en: "Unscramble the word to win coins!",
			vi: "Giải đố từ bị xáo trộn để nhận xu!"
		},
		category: "game",
		guide: {
			en: "{pn}: Start a new word scramble game.",
			vi: "{pn}: Bắt đầu trò chơi xáo trộn từ mới."
		}
	},

	onStart: async function ({ api, event }) {
		try {
			const words = [
				"FACEBOOK", "MESSENGER", "JAVASCRIPT", "NODEJS", "COMPUTER",
				"INTERNET", "PROGRAMMING", "SOFTWARE", "HARDWARE", "DATABASE",
				"ALGORITHM", "NETWORK", "SECURITY", "BROWSER", "KEYBOARD",
				"MONITOR", "PROCESSOR", "MEMORY", "STORAGE", "GRAPHICS",
				"MOBILE", "APPLICATION", "WEBSITE", "SERVER", "CLIENT",
				"PYTHON", "GITHUB", "REACTION", "MESSAGE", "FRIEND"
			];

			const originalWord = words[Math.floor(Math.random() * words.length)];
			let scrambledWord = originalWord.split('').sort(() => Math.random() - 0.5).join('');
			
			while (scrambledWord === originalWord) {
				scrambledWord = originalWord.split('').sort(() => Math.random() - 0.5).join('');
			}

			const body = `╔═══ 𝐒𝐂𝐑𝐀𝐌𝐁𝐋𝐄 ═══╗\n` +
				`║ 🔠 Word: **${scrambledWord}**\n` +
				`║ 💡 Hint: Tech/Social\n` +
				`║ 💰 Reward: 500 Coins\n` +
				`║ ⏱️ Time: 30 Seconds\n` +
				`╚══════════════════╝`;

			const info = await api.sendMessage(body, event.threadID, event.messageID);

				if (!global.irfbot) global.irfbot = {};
				if (!global.irfbot.ncReply) global.irfbot.ncReply = new Map();

				global.irfbot.ncReply.set(info.messageID, {
					commandName: this.config.name,
					type: "reply",
					messageID: info.messageID,
					author: event.senderID,
					correctWord: originalWord,
					isEnded: false
				});

				setTimeout(async () => {
					const gameState = global.irfbot.ncReply.get(info.messageID);
					if (gameState && !gameState.isEnded) {
						gameState.isEnded = true;
						api.sendMessage(`╔═══ 𝐓𝐈𝐌𝐄'𝐒 𝐔𝐏 ═══╗\n║ ⏰ Game Over!\n║ ✅ Word: **${originalWord}**\n╚══════════════════╝`, event.threadID);
						global.irfbot.ncReply.delete(info.messageID);
					}
				}, 30000);

		} catch (error) {
			api.sendMessage("╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ Game failed\n╚══════════════════╝", event.threadID, event.messageID);
		}
	},

	ncReply: async function ({ api, event, Reply, usersData }) {
		const { correctWord, messageID, isEnded } = Reply;
		const userGuess = event.body?.trim().toUpperCase();

		if (isEnded) return;

		if (userGuess === correctWord) {
			Reply.isEnded = true;
			
			try {
				const reward = 500;
				const userData = await usersData.get(event.senderID);
				userData.money = (userData.money || 0) + reward;
				await usersData.set(event.senderID, userData);

				const successMsg = `╔═══ 𝐖𝐈𝐍𝐍𝐄𝐑 ═══╗\n` +
					`║ 🎉 Correct: **${correctWord}**\n` +
					`║ 👤 User: @${event.senderID}\n` +
					`║ 💰 Reward: +${reward} Coins\n` +
					`╚══════════════════╝`;

				api.sendMessage(successMsg, event.threadID, event.messageID);
				global.irfbot.ncReply.delete(messageID);
			} catch (error) {
				api.sendMessage(`╔═══ 𝐖𝐈𝐍𝐍𝐄𝐑 ═══╗\\n║ ✅ Correct: **${correctWord}**\\n╚══════════════════╝`, event.threadID, event.messageID);
		}
	}
	}
};
