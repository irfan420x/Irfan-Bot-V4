const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "kick",
    aliases: ["remove"],
    version: "3.1.0",
    author: "Irfan Ahmmed",
    role: 1,
    usePrefix: true,
    category: "group",
    shortDescription: "Kick a member from group",
    longDescription: "Kick members and view kick history",
    guide: {
      en: "{pn} @mention | reply | uid\n{pn} list"
    }
  },

  onStart: async function ({
    api,
    event,
    args,
    message,
    usersData,
    threadsData
  }) {
    const { threadID, senderID, messageReply, mentions } = event;
    const botID = api.getCurrentUserID();

    // ===== Get thread info =====
    const info = await api.getThreadInfo(threadID);

    // ===== Bot admin check =====
    const botIsAdmin = info.adminIDs?.some(a => a.id == botID);
    if (!botIsAdmin) {
      return message.reply(
        "⚠️ Bot is not an admin.\n👉 Please make the bot admin first."
      );
    }

    // ===== Sender admin check =====
    const senderIsAdmin = info.adminIDs?.some(a => a.id == senderID);
    if (!senderIsAdmin) {
      return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ❌ Only group admins can use this command.\n╚══════════════════╝");
    }

    // ===== Load kick history =====
    let kickLogs =
      (await threadsData.get(threadID, "data.kickLogs", [])) || [];

    // ===== Show kick history =====
    if (args[0] === "list") {
      if (!kickLogs.length) {
        return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ 📭 No kick history found.\n╚══════════════════╝");
      }

      const text = kickLogs
        .slice(-10)
        .map(
          (e, i) =>
            `${i + 1}. 👤 ${e.targetName}\n` +
            `   👮 By: ${e.byName}\n` +
            `   🕒 ${e.time}`
        )
        .join("\n\n");

      return message.reply(`📜 Kick History (last 10)\n\n${text}`);
    }

    // ===== Get target UID =====
    let targetID;

    if (mentions && Object.keys(mentions).length > 0) {
      targetID = Object.keys(mentions)[0];
    } else if (messageReply) {
      targetID = messageReply.senderID;
    } else if (args[0]) {
      targetID = args[0];
    }

    if (!targetID) {
      return message.reply(
        "⚠️ Please mention, reply, or provide UID to kick."
      );
    }

    // ===== Prevent self kick =====
    if (targetID == botID) {
      return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ❌ I cannot kick myself.\n╚══════════════════╝");
    }

    if (targetID == senderID) {
      return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ❌ You cannot kick yourself.\n╚══════════════════╝");
    }

    // ===== Prevent kicking admin =====
    if (info.adminIDs?.some(a => a.id == targetID)) {
      return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ❌ You cannot kick an admin.\n╚══════════════════╝");
    }

    // ===== Get names =====
    const targetName =
      (await usersData.getName(targetID)) || "Unknown User";
    const byName =
      (await usersData.getName(senderID)) || "Unknown Admin";

    // ===== Kick user =====
    try {
      await api.removeUserFromGroup(targetID, threadID);
    } catch (err) {
      return message.reply("╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ Failed to kick the user.\n╚══════════════════╝");
    }

    // ===== Save kick history =====
    kickLogs.push({
      targetID,
      targetName,
      byID: senderID,
      byName,
      time: moment()
        .tz("Asia/Dhaka")
        .format("DD/MM/YYYY HH:mm:ss")
    });

    await threadsData.set(threadID, kickLogs, "data.kickLogs");

    // ===== Success message =====
    return message.reply(
      `✅ User kicked successfully\n\n👤 User: ${targetName}\n👮 By: ${byName}`
    );
  }
};