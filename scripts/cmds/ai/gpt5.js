const A = require("axios");
const nix = "https://raw.githubusercontent.com/noobcore404/NC-STORE/refs/heads/main/NCApiUrl.json";

module.exports = {
  config: {
    name: "gpt",
    aliases: ["chatgpt", "gpt5"],
    version: "0.0.1",
    author: "Irfan Ahmmed",
    role: 0,
    category: "Ai"
  },

  onStart: async function ({ api, message, args, event }) {
    const Q = args.join(" ");
    if (!Q) return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ Please ask a question 🍌\n╚══════════════════╝");

    api.setMessageReaction("⏳", event.messageID, event.threadID);

    try {
      let Ans;
      try {
        const { data: J } = await A.get(nix);
        const B = J.aryan;
        const { data: R } = await A.get(`${B}/aryan/ask?prompt=${encodeURIComponent(Q)}`);
        Ans = R.answer.replace(/\*/g, "");
      } catch (e) {
        // Fallback GPT API
        const fallback = await A.get(`https://api.sandipbaruwal.com/gpt?prompt=${encodeURIComponent(Q)}`);
        Ans = fallback.data.answer || fallback.data.response;
      }

      if (!Ans) throw new Error("No response");

      message.reply(Ans, (err, info) => {
        api.setMessageReaction("✅", event.messageID, event.threadID);
        global.irfbot.ncReply.set(info.messageID, {
          commandName: "gpt",
          author: event.senderID
        });
      });
    } catch {
      api.setMessageReaction("❌", event.messageID, event.threadID);
      message.reply("╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ API error 😈\n╚══════════════════╝");
    }
  },

  ncReply: async function ({ api, message, event, Reply }) {
    if (event.senderID !== Reply.author) return;

    api.setMessageReaction("⏳", event.messageID, event.threadID);

    try {
      let Ans;
      try {
        const { data: J } = await A.get(nix);
        const B = J.aryan;
        const { data: R } = await A.get(`${B}/aryan/ask?prompt=${encodeURIComponent(event.body)}`);
        Ans = R.answer.replace(/\*/g, "");
      } catch (e) {
        // Fallback GPT API
        const fallback = await A.get(`https://api.sandipbaruwal.com/gpt?prompt=${encodeURIComponent(event.body)}`);
        Ans = fallback.data.answer || fallback.data.response;
      }

      if (!Ans) throw new Error("No response");

      message.reply(Ans, (err, info) => {
        api.setMessageReaction("✅", event.messageID, event.threadID);
        global.irfbot.ncReply.set(info.messageID, {
          commandName: "gpt",
          author: event.senderID
        });
      });
    } catch {
      api.setMessageReaction("❌", event.messageID, event.threadID);
      message.reply("╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ API error 😈\n╚══════════════════╝");
    }
  }
};