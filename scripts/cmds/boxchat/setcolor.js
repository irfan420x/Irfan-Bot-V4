module.exports = {
	config: {
		name: "setcolor",
		aliases: ["changecolor", "color"],
		version: "1.1",
		author: "Manus",
		countDown: 5,
		role: 1,
		shortDescription: {
			vi: "Thay đổi màu sắc của nhóm",
			en: "Change group color"
		},
		description: {
			vi: "Thay đổi màu sắc mặc định của nhóm chat",
			en: "Change the default color of the chat group"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} <mã màu/hex>: Thay đổi màu sắc của nhóm thành <mã màu/hex>",
			en: "   {pn} <color/hex>: Change group color to <color/hex>"
		}
	},

	langs: {
		vi: {
			missingColor: "╭───────╮\n   ⚠️ 𝗘𝗥𝗥𝗢𝗥\n╰───────╯\n\n» Vui lòng nhập mã màu hoặc hex bạn muốn đặt cho nhóm!",
			success: "╭───────╮\n   ✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n╰───────╯\n\n» Đã thay đổi màu sắc của nhóm thành công!\n» Trạng thái: Hoàn tất ✨",
			error: "╭───────╮\n   ❌ 𝗙𝗔𝗜𝗟𝗘𝗗\n╰───────╯\n\n» Đã xảy ra lỗi khi thay đổi màu sắc:\n» %1"
		},
		en: {
			missingColor: "╭───────╮\n   ⚠️ 𝗘𝗥𝗥𝗢𝗥\n╰───────╯\n\n» Please enter the color code or hex you want to set for the group!",
			success: "╭───────╮\n   ✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n╰───────╯\n\n» Successfully changed group color!\n» Status: Completed ✨",
			error: "╭───────╮\n   ❌ 𝗙𝗔𝗜𝗟𝗘𝗗\n╰───────╯\n\n» An error occurred while changing color:\n» %1"
		}
	},

	ncStart: async function ({ api, args, message, event, getLang }) {
		const color = args[0];
		if (!color) return message.reply(getLang("missingColor"));

		api.changeThreadColor(color, event.threadID, (err) => {
			if (err) return message.reply(getLang("error", err.errorDescription || err.errorMessage || JSON.stringify(err)));
			return message.reply(getLang("success"));
		});
	}
};
