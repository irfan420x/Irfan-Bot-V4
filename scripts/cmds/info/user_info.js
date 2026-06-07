"use strict";

module.exports = {
  config: {
    name: "userinfo",
    aliases: ["info", "profile"],
    version: "1.0.0",
    author: "Irfan Ahmmed",
    countDown: 5,
    role: 0,
    description: "Get detailed information about a Facebook user.",
    category: "info",
    guide: "{pn} [user ID or reply to message]"
  },

  onStart: async function ({ api, event, args, message }) {
    let targetID = event.senderID;

    if (args[0]) {
      targetID = args[0];
    } else if (event.messageReply) {
      targetID = event.messageReply.senderID;
    }

    if (!targetID) {
      return message.reply("╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ Please provide a user ID or reply to a message.\n╚══════════════════╝");
    }

    message.reply("╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ Fetching user information, please wait...\n╚══════════════════╝");

    try {
      if (!api.getUserInfoV2) {
        throw new Error("API getUserInfoV2 is not available in your FCA.");
      }

      api.getUserInfoV2(targetID, (err, data) => {
        if (err) {
          return message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ Failed to fetch user info: ${err.error || err}\n╚══════════════════╝`);
        }

        const userInfo = data[targetID];

        if (!userInfo || !userInfo.name) {
          return message.reply("╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ User not found or no information available.\n╚══════════════════╝");
        }

        const responseMessage = `╔═══ 𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎 ═══╗\n` +
          `║ 𝐍𝐚𝐦𝐞: ${userInfo.name}\n` +
          `║ 𝐅𝐢𝐫𝐬𝐭 𝐍𝐚𝐦𝐞: ${userInfo.firstName || "N/A"}\n` +
          `║ 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${userInfo.vanity || "N/A"}\n` +
          `║ 𝐆𝐞𝐧𝐝𝐞𝐫: ${userInfo.gender || "N/A"}\n` +
          `║ 𝐅𝐫𝐢𝐞𝐧𝐝𝐬𝐡𝐢𝐩: ${userInfo.friendshipStatus || "N/A"}\n` +
          `║ 𝐏𝐫𝐨𝐟𝐢𝐥𝐞 𝐔𝐑𝐋: ${userInfo.profileUrl || "N/A"}\n` +
          `╚══════════════════╝`;

        message.reply(responseMessage);
      });
    } catch (error) {
      message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ An unexpected error occurred:\n║ ${error.message}\n╚══════════════════╝`);
    }
  }
};
