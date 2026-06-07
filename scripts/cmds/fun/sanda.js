const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "sanda",
    version: "1.0.2",
    author: "Irfan Ahmmed", 
    countDown: 5,
    role: 0,
    shortDescription: "Expose someone as a sanda!",
    longDescription: "Puts the tagged/replied user's face on a sanda's body (fun meme)",
    guide: {
      en: "{pn} @mention or reply to sanda someone",
    },
  },

  onStart: async function ({ event, message, api }) {
    let targetID = Object.keys(event.mentions)[0];
    if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
    }

    if (!targetID) {
      return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ❗ Tag or reply to someone to turn them into a sanda!\n╚══════════════════╝");
    }

    if (targetID === event.senderID) {
      return message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║ ❗ Bro, why would you sanda yourself?\n╚══════════════════╝");
    }

    const baseFolder = path.join(__dirname, "NAFIJ");
    const bgPath = path.join(baseFolder, "sanda.jpg");
    const avatarPath = path.join(baseFolder, `avatar_${targetID}.png`);
    const outputPath = path.join(baseFolder, `sanda_result_${targetID}.png`);

    try {
      if (!fs.existsSync(baseFolder)) fs.mkdirSync(baseFolder);

      // Download sanda image if missing
      if (!fs.existsSync(bgPath)) {
        const imgUrl = require("path").join(__dirname, "../../assets/images/sanda.png");
        const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(bgPath, res.data);
      }

      // Download avatar from Facebook Graph API
      const avatarBuffer = (
        await axios.get(`https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
          responseType: "arraybuffer",
        })
      ).data;

      await fs.writeFile(avatarPath, avatarBuffer);

      const avatarImg = await jimp.read(avatarPath);
      avatarImg.circle();
      await avatarImg.writeAsync(avatarPath);

      const bg = await jimp.read(bgPath);
      bg.resize(600, 800); // standard size

      const avatarCircle = await jimp.read(avatarPath);
      avatarCircle.resize(130, 130); // adjust head size

      // Center horizontally based on background width
      const xCenter = (bg.getWidth() - avatarCircle.getWidth()) / 2;
      const yTop = 60; // keep vertical position near sanda's head

      bg.composite(avatarCircle, xCenter, yTop);

      const finalBuffer = await bg.getBufferAsync("image/png");
      fs.writeFileSync(outputPath, finalBuffer);

      const userInfo = await api.getUserInfo(targetID);
      const tagName = userInfo[targetID]?.name || "Someone";

      await message.reply(
        {
          body: `🤣😹\n${tagName} এখন একদম আসল সান্দা হইছে!\n🦥✨`,
          mentions: [{ tag: tagName, id: targetID }],
          attachment: fs.createReadStream(outputPath),
        },
        () => {
          fs.unlinkSync(avatarPath);
          fs.unlinkSync(outputPath);
        }
      );
    } catch (err) {
      console.error(" Sanda Command Error:", err);
      message.reply("╔═══ 𝐈𝐍𝐅𝐎 ═══╗\n║  সমস্যা হইসে ভাই। আরেকবার try দে।\n╚══════════════════╝");
    }
  },
};