const { getTime, getStreamFromURL } = global.utils;

function genConvert(gender) {
  if (gender === 2 || gender === "MALE") return "Male";
  if (gender === 1 || gender === "FEMALE") return "Female";
  return "Unknown";
}

module.exports = {
  config: {
    name: "spy",
    aliases: ["userinfo", "whois"],
    version: "6.1.0",
    author: "Irfan Ahmmed",
    role: 0,
    usePrefix: true,
    category: "info",
    description: "User information with full realtime data",
    guide: {
      en:
        "╔═══ 🕵️ USER SPY ═══╗\n" +
        "║ {pn}\n" +
        "║ {pn} @tag | reply | <uid>\n" +
        "╚══════════════════╝"
    }
  },

  langs: {
    en: {
      spyInfo:
        "╔══════════════════╗\n" +
        "║  🕵️  " + "ＵＳＥＲ  ＩＮＦＯ" + "  ║\n" +
        "╠══════════════════╣\n" +
        "║ 👤 Name: %1\n" +
        "║ 🆔 UID: %2\n" +
        "║ 🚻 Gender: %4\n" +
        "║ 🧾 Type: %6\n" +
        "╠══════════════════╣\n" +
        "║      " + "ＥＣＯＮＯＭＹ" + "      ║\n" +
        "╠══════════════════╣\n" +
        "║ 💰 Money: %8\n" +
        "║ ⭐ EXP: %9\n" +
        "║ 🧠 Level: %10\n" +
        "╠══════════════════╣\n" +
        "║      " + "ＧＲＯＵＰ  ＳＴＡＴＳ" + "      ║\n" +
        "╠══════════════════╣\n" +
        "║ 👮 Admin: %13\n" +
        "║ 💬 Messages: %14\n" +
        "║ 🏷 Nickname: %15\n" +
        "╚══════════════════╝",

      yes: "Yes",
      no: "No",
      unknown: "Unknown",
      lifetime: "Permanent",
      expired: "Expired",
      userNotFound: "❌ User data not found"
    }
  },

  onStart: async function ({
    api,
    args,
    usersData,
    threadsData,
    message,
    event,
    getLang
  }) {
    try {
      let uid;
      if (event.type === "message_reply") uid = event.messageReply.senderID;
      else if (Object.keys(event.mentions || {}).length)
        uid = Object.keys(event.mentions)[0];
      else if (args[0] && !isNaN(args[0])) uid = args[0];
      else uid = event.senderID;

      const user = await usersData.get(uid).catch(() => null);
      const fbData = await api.getUserInfo(uid).catch(() => null);

      if (!user && !fbData) return message.reply(getLang("userNotFound"));

      const fb = fbData?.[uid] || {};

      const name = user?.name || fb.name || "Unknown";
      const username = user?.vanity || fb.vanity || getLang("unknown");
      const gender = genConvert(user?.gender || fb.gender);

      const isBotFriend =
        typeof fb.isFriend === "boolean"
          ? fb.isFriend
            ? getLang("yes")
            : getLang("no")
          : user?.isBotFriend
          ? getLang("yes")
          : getLang("no");

      const type = user?.type || fb.type || "User";
      const language = user?.language || "en";

      const money = user?.money || 0;
      const exp = user?.exp || 0;
      const level = Math.floor(Math.sqrt(exp / 100));

      const premium = user?.data?.premium || {
        status: false,
        expireTime: null
      };

      const formatExpire = (t) =>
        t == null
          ? getLang("lifetime")
          : Date.now() > t
          ? getLang("expired")
          : getTime(t, "DD/MM/YYYY HH:mm:ss");

      let isAdmin = getLang("no");
      let msgCount = 0;
      let nickname = "-";
      let inGroup = getLang("no");

      if (event.isGroup) {
        const thread = await threadsData.get(event.threadID).catch(() => null);

        if (thread?.adminIDs) {
          const adminCheck = thread.adminIDs.some((admin) => {
            if (typeof admin === "string") return admin == uid;
            if (typeof admin === "object")
              return admin.id == uid || admin.userID == uid;
            return false;
          });
          if (adminCheck) isAdmin = getLang("yes");
        }

        const member = (thread?.members || []).find(
          (m) => m.userID == uid
        );

        if (member) {
          inGroup = getLang("yes");
          msgCount = member.count || 0;
          nickname = member.nickname || "-";
        }

        if (isAdmin === getLang("no")) {
          try {
            const info = await api.getThreadInfo(event.threadID);
            if (info.adminIDs?.some((a) => a.id == uid))
              isAdmin = getLang("yes");
          } catch {}
        }
      }

      const avatarUrl =
        (await usersData.getAvatarUrl(uid).catch(() => null)) ||
        fb.profilePicUrl;

      return message.reply({
        body: getLang(
          "spyInfo",
          name,
          uid,
          username,
          gender,
          isBotFriend,
          type,
          language,
          money.toLocaleString(),
          exp,
          level,
          premium.status ? getLang("yes") : getLang("no"),
          premium.status ? formatExpire(premium.expireTime) : "-",
          isAdmin,
          msgCount,
          nickname,
          inGroup
        ),
        attachment: avatarUrl
          ? await getStreamFromURL(avatarUrl)
          : null
      });
    } catch (err) {
      console.log("Spy error:", err);
      return message.reply("╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ ❌ Spy command failed.\n╚══════════════════╝");
    }
  }
};