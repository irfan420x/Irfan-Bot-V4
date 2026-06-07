module.exports = {
	config: {
		name: "feed",
		version: "1.1",
		author: "Irfan Ahmmed",
		countDown: 10,
		role: 0,
		description: {
			vi: "Xem và tương tác với bảng tin",
			en: "View and interact with news feed"
		},
		category: "media",
		guide: {
			vi: "   {pn}: Xem bảng tin"
				+ "\n   {pn} react <postID> <type>: Thả cảm xúc vào bài viết"
				+ "\n   {pn} comment <postID> <text>: Bình luận vào bài viết",
			en: "   {pn}: View news feed"
				+ "\n   {pn} react <postID> <type>: React to a post"
				+ "\n   {pn} comment <postID> <text>: Comment on a post"
		}
	},

	onStart: async function ({ message, event, args, api }) {
		const { threadID, messageID } = event;
		const action = args[0];

		try {
			if (!action) {
				message.reply("╔═══ 𝐅𝐄𝐄𝐃 ═══╗\n║ ⏳ Fetching feed...\n║ 🌐 Connecting to FB\n╚══════════════════╝");
				api.getNewsFeed(5, (err, data) => {
					if (err) return message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ ${err.message || "Fetch failed"}\n╚══════════════════╝`);
					message.reply("╔═══ 𝐅𝐄𝐄𝐃 ═══╗\n║ ✅ Feed fetched!\n║ 🛠️ (In development)\n╚══════════════════╝");
				});
			} else if (action === "react") {
				const postID = args[1];
				const type = args[2] || "like";
				if (!postID) return message.reply("╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ ⚠️ Provide post ID\n╚══════════════════╝");
				api.setPostReaction(postID, type, (err, data) => {
					if (err) return message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ Reaction failed\n╚══════════════════╝`);
					message.reply(`╔═══ 𝐑𝐄𝐀𝐂𝐓 ═══╗\n║ ✅ Reacted ${type}\n║ 🆔 ${postID}\n╚══════════════════╝`);
				});
			} else if (action === "comment") {
				const postID = args[1];
				const text = args.slice(2).join(" ");
				if (!postID || !text) return message.reply("╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ ⚠️ Provide ID & text\n╚══════════════════╝");
				api.setPostComment(postID, text, (err, data) => {
					if (err) return message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ Comment failed\n╚══════════════════╝`);
					message.reply(`╔═══ 𝐂𝐎𝐌𝐌𝐄𝐍𝐓 ═══╗\n║ ✅ Commented!\n║ 🆔 ${postID}\n╚══════════════════╝`);
				});
			}
		} catch (error) {
			message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ ${error.message}\n╚══════════════════╝`);
		}
	}
};
