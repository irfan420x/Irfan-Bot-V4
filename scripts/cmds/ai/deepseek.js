const axios = require("axios");

module.exports = {
  config: {
    name: "deepseek",
    aliases: ["ds"],
    version: "1.0.0",
    author: "Manus",
    countDown: 5,
    usePrefix: true,
    role: 0,
    shortDescription: "DeepSeek AI এর সাথে কথা বলো",
    longDescription: "DeepSeek AI ব্যবহার করে যেকোনো প্রশ্নের উত্তর পাও।",
    category: "AI",
    guide: "{pn} [প্রশ্ন]"
  },

  ncStart: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage("╭─── 𝐈𝐍𝐅𝐎 ───╮\n│ দয়া করে একটি প্রশ্ন করুন। 😊\n╰──────────────╯", threadID, messageID);
    }

    api.setMessageReaction("⏳", messageID, threadID, () => {}, true);

    try {
      // Using a public API for DeepSeek (example endpoint)
      const res = await axios.get(`https://api.sandipbaruwal.com/deepseek?prompt=${encodeURIComponent(prompt)}`);
      const reply = res.data.answer || res.data.response;

      if (!reply) throw new Error("No response from DeepSeek API.");

      api.setMessageReaction("✅", messageID, threadID, () => {}, true);
      
      api.sendMessage(reply, threadID, (err, info) => {
        if (!info) return;
        global.noobCore.ncReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID
        });
      }, messageID);

    } catch (error) {
      console.error("[DeepSeek Error]", error.message);
      api.setMessageReaction("❌", messageID, threadID, () => {}, true);
      api.sendMessage("╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ DeepSeek API এখন কাজ করছে না। পরে চেষ্টা করো। 😴\n╰──────────────╯", threadID, messageID);
    }
  },

  ncReply: async function({ api, event, Reply }) {
    if (event.senderID !== Reply.author) return;
    
    const prompt = event.body;
    if (!prompt) return;

    api.setMessageReaction("⏳", event.messageID, event.threadID, () => {}, true);

    try {
      const res = await axios.get(`https://api.sandipbaruwal.com/deepseek?prompt=${encodeURIComponent(prompt)}`);
      const reply = res.data.answer || res.data.response;

      if (!reply) throw new Error("No response from DeepSeek API.");

      api.setMessageReaction("✅", event.messageID, event.threadID, () => {}, true);
      
      api.sendMessage(reply, event.threadID, (err, info) => {
        if (!info) return;
        global.noobCore.ncReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID
        });
      }, event.messageID);

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, event.threadID, () => {}, true);
      api.sendMessage("╭─── 𝐄𝐑𝐑𝐎𝐑 ───╮\n│ DeepSeek API এখন কাজ করছে না। পরে চেষ্টা করো। 😴\n╰──────────────╯", event.threadID, event.messageID);
    }
  }
};
