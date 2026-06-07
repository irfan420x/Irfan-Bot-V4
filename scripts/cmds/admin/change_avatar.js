"use strict";

module.exports = {
  config: {
    name: "changeavatar",
    aliases: ["setavatar", "avatar"],
    version: "1.0.0",
    author: "Irfan Ahmmed",
    countDown: 10,
    role: 0, // All users can change their own avatar
    description: "Change the bot's (or your own) Facebook profile picture.",
    category: "admin", // Categorized as admin because it modifies profile, but accessible to all for their own profile
    guide: "{pn} [reply to image/video]"
  },

  onStart: async function ({ api, event, message }) {
    const userID = event.senderID;

    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return message.reply("╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ Please reply to an image or video to set it as the new avatar.\n╰────── ──────╯");
    }

    const attachment = event.messageReply.attachments[0];

    if (attachment.type !== "Photo" && attachment.type !== "Video") {
      return message.reply("╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ Only images and videos are supported for avatar changes.\n╰────── ──────╯");
    }

    message.reply("╭─── 𝐒𝐘𝐒𝐓𝐄𝐌 ───╮\n│ Changing avatar, please wait...\n╰────── ──────╯");

    try {
      if (!api.changeAvatar) {
        throw new Error("API changeAvatar is not available in your FCA.");
      }

      // Download the attachment to a readable stream
      const axios = require("axios");
      const fs = require("fs");
      const path = require("path");
      const imagePath = path.join(__dirname, `avatar_${userID}.tmp`);

      const response = await axios.get(attachment.url, { responseType: "stream" });
      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      const imageStream = fs.createReadStream(imagePath);

      api.changeAvatar(imageStream, (err) => {
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) console.error("Failed to delete temporary avatar file:", unlinkErr);
        });

        if (err) {
          return message.reply(`╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ Failed to change avatar: ${err.error || err}\n╰────── ──────╯`);
        }
        message.reply("╭─── 𝐒𝐔𝐂𝐂𝐄𝐒𝐒 ───╮\n│ Avatar changed successfully!\n╰────── ──────╯");
      });
    } catch (error) {
      message.reply(`╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ An unexpected error occurred:\n│ ${error.message}\n╰────── ──────╯`);
    }
  }
};
