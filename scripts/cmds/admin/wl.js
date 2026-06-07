const { ncsetting } = global.irfbot;
const { client } = global;
const { writeFileSync } = require("fs-extra");
const config = ncsetting;

module.exports = {
  config: {
    name: "wl",
    aliases: ["wlonly", "whitelist"],
    version: "2.0",
    author: "Irfan Ahmmed", // Fixed by Yeasin Arafat 
    countDown: 5,
    role: 3,
    description: {
      en: "Manage whitelist users for bot access control",
    },
    category: "owner",
    guide: {
      en:
        "\n" +
        "╔════════════════════╗\n" +
        "║   WHITELIST MENU   ║\n" +
        "╚════════════════════╝\n" +
        "\n" +
        "➤ {pn} add [uid/@tag] - Add user to whitelist\n" +
        "➤ {pn} remove [uid/@tag] - Remove user from whitelist\n" +
        "➤ {pn} list - Show all whitelisted users\n" +
        "➤ {pn} check [uid/@tag] - Check if user is whitelisted\n" +
        "➤ {pn} mode [on/off] - Toggle whitelist-only mode\n" +
        "➤ {pn} noti [on/off] - Toggle notification for non-whitelisted users\n" +
        "➤ {pn} clear - Clear all whitelisted users\n" +
        "➤ {pn} count - Show total whitelisted users\n" +
        ""
    },
  },

  langs: {
    en: {
      added: `╔═══ ✅ 𝗔𝗗𝗗𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬\n║✦ 𝗔𝗱𝗱𝗲𝗱: %1 𝘂𝘀𝗲𝗿(𝘀)\n%2\n╚══════════════════╝✦ 𝗧𝗼𝘁𝗮𝗹 𝗪𝗵𝗶𝘁𝗲𝗹𝗶𝘀𝘁𝗲𝗱: %3`,

      alreadyAdded: `╔═══ ⚠️  𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗜𝗡 𝗪𝗛𝗜𝗧𝗘𝗟𝗜𝗦𝗧\n║✦ 𝗨𝘀𝗲𝗿𝘀: %1\n%2\n╚══════════════════╝✦ 𝗧𝗼𝘁𝗮𝗹 𝗪𝗵𝗶𝘁𝗲𝗹𝗶𝘀𝘁𝗲𝗱: %3`,

      removed: `╔═══ ✅ 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬\n║✦ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱: %1 𝘂𝘀𝗲𝗿(𝘀)\n%2\n╚══════════════════╝✦ 𝗧𝗼𝘁𝗮𝗹 𝗪𝗵𝗶𝘁𝗲𝗹𝗶𝘀𝘁𝗲𝗱: %3`,

      notInList: `╔═══ ⚠️  𝗨𝗦𝗘𝗥𝗦 𝗡𝗢𝗧 𝗜𝗡 𝗪𝗛𝗜𝗧𝗘𝗟𝗜𝗦𝗧\n║✦ 𝗨𝘀𝗲𝗿𝘀: %1\n%2\n╚══════════════════╝✦ 𝗧𝗼𝘁𝗮𝗹 𝗪𝗵𝗶𝘁𝗲𝗹𝗶𝘀𝘁𝗲𝗱: %3`,

      missingIdAdd: "⚠️ | Please enter UID or tag user to add to whitelist",
      missingIdRemove: "⚠️ | Please enter UID or tag user to remove from whitelist",
      listHeader: `╔═══ ✨ 𝗪𝗛𝗜𝗧𝗘𝗟𝗜𝗦𝗧𝗘𝗗 𝗨𝗦𝗘𝗥𝗦\n║✦ 𝗧𝗼𝘁𝗮𝗹: %1 𝘂𝘀𝗲𝗿(𝘀)\n%2\n╚══════════════════╝✦ 𝗠𝗼𝗱𝗲: %3`,

      emptyList: "📭 | Whitelist is currently empty",
      isWhitelisted: `╔═══ ✅ 𝗪𝗛𝗜𝗧𝗘𝗟𝗜𝗦𝗧𝗘𝗗\n║✦ 𝗡𝗮𝗺𝗲: %1\n║✦ 𝗨𝗜𝗗: %2\n║✦ 𝗦𝘁𝗮𝘁𝘂𝘀: Whitelisted ✅\n╚══════════════════╝✦ 𝗧𝗼𝘁𝗮𝗹 𝗪𝗵𝗶𝘁𝗲𝗹𝗶𝘀𝘁𝗲𝗱: %3`,

      notWhitelisted: `╔═══ ❌ 𝗡𝗢𝗧 𝗪𝗛𝗜𝗧𝗘𝗟𝗜𝗦𝗧𝗘𝗗\n║✦ 𝗡𝗮𝗺𝗲: %1\n║✦ 𝗨𝗜𝗗: %2\n║✦ 𝗦𝘁𝗮𝘁𝘂𝘀: Not Whitelisted ❌\n╚══════════════════╝✦ 𝗧𝗼𝘁𝗮𝗹 𝗪𝗵𝗶𝘁𝗲𝗹𝗶𝘀𝘁𝗲𝗱: %3`,

      turnedOn: "✅ | Whitelist-only mode: **ENABLED**",
      turnedOff: "❎ | Whitelist-only mode: **DISABLED**",
      turnedOnNoti: "🔔 | Non-whitelist notifications: **ENABLED**",
      turnedOffNoti: "🔕 | Non-whitelist notifications: **DISABLED**",
      cleared: "🗑️ | Whitelist has been cleared successfully",
      confirmClear: "⚠️ | Are you sure you want to clear ALL whitelisted users? Reply 'yes' to confirm.",
      count: `📊 | Total whitelisted users: **%1**`,
      modeStatus: `📊 | Whitelist Status\n╠══════════════════╣ Mode: %1\n╠══════════════════╣ Total Users: %2\n└─ Notifications: %3`
    },
  },

  onStart: async function ({ message, args, usersData, event, getLang, api, commandName }) {
    const permission = global.irfbot.ncsetting.adminBot;
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ⚠️ | You don't have permission to use this command!\n╚══════════════════╝", event.threadID, event.messageID);
    }

    // Initialize whitelist if not exists
    if (!config.whiteListMode) {
      config.whiteListMode = {
        enable: false,
        whiteListIds: []
      };
    }
    if (!config.hideNotiMessage) {
      config.hideNotiMessage = {};
    }

    // Show help if no arguments
    if (args.length === 0) {
      const guide = this.config.guide.en;
      return message.reply(guide.replace(/\{pn\}/g, commandName));
    }

    const action = args[0].toLowerCase();

    switch (action) {
      case "add":
      case "-a":
      case "+": {
        if (args.length < 2) {
          return message.reply(getLang("missingIdAdd"));
        }

        let uids = [];

        // Get UIDs from mentions
        if (Object.keys(event.mentions).length > 0) {
          uids = Object.keys(event.mentions);
        } 
        // Get UID from message reply
        else if (event.messageReply) {
          uids.push(event.messageReply.senderID);
        } 
        // Get UIDs from arguments
        else {
          const uidArgs = args.slice(1).filter(arg => !isNaN(arg) && arg.length >= 9);
          uids = [...new Set(uidArgs)]; // Remove duplicates
        }

        if (uids.length === 0) {
          return message.reply(getLang("missingIdAdd"));
        }

        const newUsers = [];
        const existingUsers = [];

        // Categorize users
        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) {
            existingUsers.push(uid);
          } else {
            newUsers.push(uid);
            config.whiteListMode.whiteListIds.push(uid);
          }
        }

        // Remove duplicates from whitelist
        config.whiteListMode.whiteListIds = [...new Set(config.whiteListMode.whiteListIds)];

        // Get user info
        const getUserInfo = async (uid) => {
          try {
            const name = await usersData.getName(uid);
            return {
              uid,
              name: name || "Unknown User",
              index: config.whiteListMode.whiteListIds.indexOf(uid) + 1
            };
          } catch {
            return { uid, name: "Unknown User", index: config.whiteListMode.whiteListIds.indexOf(uid) + 1 };
          }
        };

        const newUsersInfo = await Promise.all(newUsers.map(getUserInfo));
        const existingUsersInfo = await Promise.all(existingUsers.map(getUserInfo));

        // Save config
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        // Build response
        let response = "";
        const totalUsers = config.whiteListMode.whiteListIds.length;

        if (newUsersInfo.length > 0) {
          response += getLang(
            "added",
            newUsersInfo.length,
            newUsersInfo.map(user => 
              `║ ╠══════════════════╣ #${user.index} ${user.name}\n║ └─ UID: ${user.uid}`
            ).join("\n║\n"),
            totalUsers
          );
        }

        if (existingUsersInfo.length > 0) {
          if (response) response += "\n\n";
          response += getLang(
            "alreadyAdded",
            existingUsersInfo.length,
            existingUsersInfo.map(user => 
              `║ ╠══════════════════╣ #${user.index} ${user.name}\n║ └─ UID: ${user.uid}`
            ).join("\n║\n"),
            totalUsers
          );
        }

        return message.reply(response || "No changes made.");
      }

      case "remove":
      case "rm":
      case "-r":
      case "-": {
        if (args.length < 2) {
          return message.reply(getLang("missingIdRemove"));
        }

        let uids = [];

        // Get UIDs from mentions
        if (Object.keys(event.mentions).length > 0) {
          uids = Object.keys(event.mentions);
        } 
        // Get UID from message reply
        else if (event.messageReply) {
          uids.push(event.messageReply.senderID);
        } 
        // Get UIDs from arguments
        else {
          const uidArgs = args.slice(1).filter(arg => !isNaN(arg) && arg.length >= 9);
          uids = [...new Set(uidArgs)]; // Remove duplicates
        }

        if (uids.length === 0) {
          return message.reply(getLang("missingIdRemove"));
        }

        const removedUsers = [];
        const notFoundUsers = [];

        // Categorize users
        for (const uid of uids) {
          const index = config.whiteListMode.whiteListIds.indexOf(uid);
          if (index !== -1) {
            removedUsers.push({ uid, originalIndex: index + 1 });
            config.whiteListMode.whiteListIds.splice(index, 1);
          } else {
            notFoundUsers.push(uid);
          }
        }

        // Save config
        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        // Get user info
        const getUserInfo = async (user) => {
          try {
            const name = await usersData.getName(user.uid);
            return { ...user, name: name || "Unknown User" };
          } catch {
            return { ...user, name: "Unknown User" };
          }
        };

        const removedUsersInfo = await Promise.all(removedUsers.map(getUserInfo));
        const notFoundUsersInfo = await Promise.all(notFoundUsers.map(async (uid) => {
          try {
            const name = await usersData.getName(uid);
            return { uid, name: name || "Unknown User" };
          } catch {
            return { uid, name: "Unknown User" };
          }
        }));

        // Build response
        let response = "";
        const totalUsers = config.whiteListMode.whiteListIds.length;

        if (removedUsersInfo.length > 0) {
          response += getLang(
            "removed",
            removedUsersInfo.length,
            removedUsersInfo.map(user => 
              `║ ╠══════════════════╣ #${user.originalIndex} ${user.name}\n║ └─ UID: ${user.uid}`
            ).join("\n║\n"),
            totalUsers
          );
        }

        if (notFoundUsersInfo.length > 0) {
          if (response) response += "\n\n";
          response += getLang(
            "notInList",
            notFoundUsersInfo.length,
            notFoundUsersInfo.map(user => 
              `║ ╠══════════════════╣ ${user.name}\n║ └─ UID: ${user.uid}`
            ).join("\n║\n"),
            totalUsers
          );
        }

        return message.reply(response || "No changes made.");
      }

      case "list":
      case "-l":
      case "show": {
        if (!config.whiteListMode.whiteListIds || config.whiteListMode.whiteListIds.length === 0) {
          return message.reply(getLang("emptyList"));
        }

        const modeStatus = config.whiteListMode.enable ? "🟢 ENABLED" : "🔴 DISABLED";

        // Get user info with numbering
        const userInfos = await Promise.all(
          config.whiteListMode.whiteListIds.map(async (uid, index) => {
            try {
              const name = await usersData.getName(uid);
              return `║ ╠══════════════════╣ #${index + 1} ${name || "Unknown User"}\n║ └─ UID: ${uid}`;
            } catch {
              return `║ ╠══════════════════╣ #${index + 1} Unknown User\n║ └─ UID: ${uid}`;
            }
          })
        );

        return message.reply(
          getLang(
            "listHeader",
            config.whiteListMode.whiteListIds.length,
            userInfos.join("\n║\n"),
            modeStatus
          )
        );
      }

      case "check":
      case "verify": {
        if (args.length < 2) {
          return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ⚠️ | Please enter UID or tag user to check\n╚══════════════════╝");
        }

        let targetUid;

        // Get UID from mentions
        if (Object.keys(event.mentions).length > 0) {
          targetUid = Object.keys(event.mentions)[0];
        } 
        // Get UID from message reply
        else if (event.messageReply) {
          targetUid = event.messageReply.senderID;
        } 
        // Get UID from argument
        else {
          targetUid = args[1];
          if (isNaN(targetUid)) {
            return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ⚠️ | Please enter a valid UID or tag user\n╚══════════════════╝");
          }
        }

        try {
          const name = await usersData.getName(targetUid);
          const isWhitelisted = config.whiteListMode.whiteListIds.includes(targetUid);
          const totalUsers = config.whiteListMode.whiteListIds.length;

          if (isWhitelisted) {
            return message.reply(
              getLang("isWhitelisted", name || "Unknown User", targetUid, totalUsers)
            );
          } else {
            return message.reply(
              getLang("notWhitelisted", name || "Unknown User", targetUid, totalUsers)
            );
          }
        } catch {
          return message.reply("╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ⚠️ | Failed to retrieve user information\n╚══════════════════╝");
        }
      }

      case "mode":
      case "-m":
      case "toggle": {
        if (args.length < 2 || !["on", "off"].includes(args[1].toLowerCase())) {
          return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ⚠️ | Usage: wl mode [on/off]\n╚══════════════════╝");
        }

        const value = args[1].toLowerCase() === "on";
        config.whiteListMode.enable = value;

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(getLang(value ? "turnedOn" : "turnedOff"));
      }

      case "noti":
      case "notification":
      case "-n": {
        if (args.length < 2 || !["on", "off"].includes(args[1].toLowerCase())) {
          return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ⚠️ | Usage: wl noti [on/off]\n╚══════════════════╝");
        }

        const value = args[1].toLowerCase() === "on";
        config.hideNotiMessage.whiteListMode = !value;

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(getLang(value ? "turnedOnNoti" : "turnedOffNoti"));
      }

      case "clear":
      case "reset": {
        if (config.whiteListMode.whiteListIds.length === 0) {
          return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ✅ | Whitelist is already empty\n╚══════════════════╝");
        }

        // Check for confirmation
        if (args[1] !== "confirm") {
          return message.reply(getLang("confirmClear"));
        }

        const previousCount = config.whiteListMode.whiteListIds.length;
        config.whiteListMode.whiteListIds = [];

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(`${getLang("cleared")}\nRemoved ${previousCount} users from whitelist.`);
      }

      case "count":
      case "total": {
        const total = config.whiteListMode.whiteListIds.length;
        const modeStatus = config.whiteListMode.enable ? "✅ ON" : "❌ OFF";
        const notiStatus = config.hideNotiMessage.whiteListMode === false ? "✅ ON" : "❌ OFF";

        return message.reply(
          getLang("modeStatus", modeStatus, total, notiStatus)
        );
      }

      case "status":
      case "info": {
        const total = config.whiteListMode.whiteListIds.length;
        const modeStatus = config.whiteListMode.enable ? "🟢 ENABLED" : "🔴 DISABLED";
        const notiStatus = config.hideNotiMessage.whiteListMode === false ? "🔔 ENABLED" : "🔕 DISABLED";

        const statusMessage = 
          `╔═══ 📊 𝗪𝗛𝗜𝗧𝗘𝗟𝗜𝗦𝗧 𝗦𝗧𝗔𝗧𝗨𝗦\n`
          `║✦ 𝗠𝗼𝗱𝗲: ${modeStatus}\n` +
          `║✦ 𝗡𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀: ${notiStatus}\n` +
          `║✦ 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀: ${total}\n` +
          `╚══════════════════╝✦ 𝗟𝗮𝘀𝘁 𝗨𝗽𝗱𝗮𝘁𝗲: ${new Date().toLocaleString()}`;

        return message.reply(statusMessage);
      }

      case "help":
      case "menu": {
        const guide = this.config.guide.en;
        return message.reply(guide.replace(/\{pn\}/g, commandName));
      }

      default: {
        // Show help if command not recognized
        const guide = this.config.guide.en;
        return message.reply(`❓ | Unknown command. Use:\n${guide.replace(/\{pn\}/g, commandName)}`);
      }
    }
  },
};