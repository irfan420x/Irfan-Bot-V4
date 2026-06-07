"use strict";

module.exports = {
    config: {
        name: "groupapprove",
        version: "1.0.0",
        author: "Irfan Ahmmed",
        countDown: 5,
        role: 1, // Admin only
        shortDescription: {
            en: "Approve or deny pending group members",
            vi: "Phê duyệt hoặc từ chối thành viên chờ duyệt"
        },
        longDescription: {
            en: "Allows group admins to approve or deny users waiting to join the group.",
            vi: "Cho phép quản trị viên phê duyệt hoặc từ chối người dùng đang chờ tham gia nhóm."
        },
        category: "admin",
        guide: {
            en: "{pn} approve <userID> | {pn} deny <userID>",
            vi: "{pn} approve <userID> | {pn} deny <userID>"
        }
    },

    onStart: async function ({ api, event, args, message }) {
        const { threadID, messageID } = event;
        const action = args[0]?.toLowerCase();
        const targetID = args[1];

        if (!action || !["approve", "deny"].includes(action) || !targetID) {
            return message.reply(`╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ ⚠️ Invalid usage!\n║ Guide: {pn} approve/deny <userID>\n╚══════════════════╝`);
        }

        message.reply(`╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ ⏳ Processing ${action} for ${targetID}...\n╚══════════════════╝`);

        try {
            await api.handleGroupPendingMember(threadID, targetID, action);
            return message.reply(`╔═══ 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 ═══╗\n║ ✅ Successfully ${action}ed user ${targetID}!\n╚══════════════════╝`);
        } catch (err) {
            console.error(err);
            return message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ Failed to ${action} user.\n║ Error: ${err.errorDescription || err.message || "Unknown error"}\n╚══════════════════╝`);
        }
    }
};
