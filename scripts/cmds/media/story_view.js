module.exports = {
	config: {
		name: "storyview",
		version: "1.1",
		author: "Irfan Ahmmed",
		countDown: 10,
		role: 0,
		description: {
			vi: "Xem và tương tác với story của bạn bè",
			en: "View and interact with friends' stories"
		},
		category: "media",
		guide: {
			vi: "   {pn}: Xem danh sách story"
				+ "\n   {pn} react <storyID> <type>: Thả cảm xúc vào story",
			en: "   {pn}: View story list"
				+ "\n   {pn} react <storyID> <type>: React to a story"
		}
	},

	onStart: async function ({ message, event, args, api }) {
		const { threadID, messageID } = event;
		const action = args[0];

		try {
			if (!action) {
				message.reply("╔═══ 𝐒𝐓𝐎𝐑𝐈𝐄𝐒 ═══╗\n║ ⏳ Fetching stories...\n║ 🌐 Connecting to FB\n╚══════════════════╝");
				api.getStories((err, data) => {
					if (err) return message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ ${err.message || "Fetch failed"}\n╚══════════════════╝`);
					message.reply("╔═══ 𝐒𝐓𝐎𝐑𝐈𝐄𝐒 ═══╗\n║ ✅ Stories fetched!\n║ 🛠️ (In development)\n╚══════════════════╝");
				});
			} else if (action === "react") {
				const storyID = args[1];
				const type = args[2] || "like";
				if (!storyID) return message.reply("╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ ⚠️ Provide story ID\n╚══════════════════╝");
				api.setStoryReaction(storyID, type, (err, data) => {
					if (err) return message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ Reaction failed\n╚══════════════════╝`);
					message.reply(`╔═══ 𝐑𝐄𝐀𝐂𝐓 ═══╗\n║ ✅ Reacted ${type}\n║ 🆔 ${storyID}\n╚══════════════════╝`);
				});
			}
		} catch (error) {
			message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ ${error.message}\n╚══════════════════╝`);
		}
	}
};
