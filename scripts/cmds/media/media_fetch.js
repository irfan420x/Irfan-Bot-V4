"use strict";

module.exports = {
  config: {
    name: "mediafetch",
    aliases: ["mf", "getmedia"],
    version: "1.1.0",
    author: "Irfan Ahmmed",
    countDown: 5,
    role: 0,
    description: "Fetch shared media (images/videos) from the current thread. Can filter by type.",
    category: "media",
    guide: "{pn} [limit] [type (image/video)]"
  },

  onStart: async function ({ api, event, args, message }) {
    const threadID = event.threadID;
    const limit = parseInt(args[0]) || 10;
    const mediaType = args[1] ? args[1].toLowerCase() : null; // 'image' or 'video'

    if (isNaN(limit) || limit <= 0) {
      return message.reply("╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ Please provide a valid limit (a positive number).\n╰────── ──────╯");
    }

    if (mediaType && mediaType !== "image" && mediaType !== "video") {
      return message.reply("╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ Invalid media type. Please use 'image' or 'video'.\n╰────── ──────╯");
    }

    message.reply("╭─── 𝐒𝐘𝐒𝐓𝐄𝐌 ───╮\n│ Fetching shared media, please wait...\n╰────── ──────╯");

    try {
      if (!api.getThreadMedia) {
        throw new Error("API getThreadMedia is not available in your FCA. Please ensure your FCA is updated.");
      }

      api.getThreadMedia(threadID, limit, (err, data) => {
        if (err) {
          console.error("Error fetching thread media:", err);
          return message.reply(`╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ Failed to fetch media: ${err.error || err.message || err}\n╰────── ──────╯`);
        }

        if (!data || !data.thread || !data.thread.message_shared_media) {
          return message.reply("╭─── 𝐈𝐍𝐅𝐎 ───╮\n│ No shared media found in this thread.\n╰────── ──────╯");
        }

        const mediaEdges = data.thread.message_shared_media.edges;
        let filteredMedia = [];

        for (const edge of mediaEdges) {
          const attachment = edge.node.message.attachments.nodes[0];
          if (attachment) {
            if (mediaType === "image" && attachment.photo) {
              filteredMedia.push(attachment.photo.image.uri);
            } else if (mediaType === "video" && attachment.video) {
              filteredMedia.push(attachment.video.playable_url);
            } else if (!mediaType) {
              // If no type specified, add both images and videos
              if (attachment.photo) filteredMedia.push(attachment.photo.image.uri);
              if (attachment.video) filteredMedia.push(attachment.video.playable_url);
            }
          }
        }

        if (filteredMedia.length === 0) {
          return message.reply(`╭─── 𝐈𝐍𝐅𝐎 ───╮\n│ No ${mediaType || ""} media found matching your criteria.\n╰────── ──────╯`);
        }

        let responseMsg = `╭─── 𝐒𝐇𝐀𝐑𝐄𝐃 𝐌𝐄𝐃𝐈𝐀 (${mediaType || "All"}) ───╮\n`;
        filteredMedia.forEach((url, index) => {
          responseMsg += `│ ${index + 1}. ${url}\n`;
        });
        responseMsg += `╰────── ───────╯`;

        message.reply(responseMsg);
      });
    } catch (error) {
      console.error("Unexpected error in mediafetch command:", error);
      message.reply(`╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ An unexpected error occurred:\n│ ${error.message}\n╰────── ──────╯`);
    }
  }
};
