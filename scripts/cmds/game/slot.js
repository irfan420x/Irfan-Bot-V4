const dn = 20;
const dp = 30;
const mbet = 6_000_000;

const em = [
  { emoji: "🍒", weight: 30 },
  { emoji: "🍋", weight: 25 },
  { emoji: "🍇", weight: 20 },
  { emoji: "🍉", weight: 15 },
  { emoji: "⭐", weight: 7 },
  { emoji: "7️⃣", weight: 3 }
];

/* ===== MONEY FORMAT ===== */
const fm = (n = 0) => {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + "QT";
  if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9)  return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6)  return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3)  return (n / 1e3).toFixed(2) + "K";
  return String(n);
};

/* ===== PARSE BET ===== */
const parseBet = (input) => {
  if (!input) return NaN;
  const s = input.toLowerCase();
  if (s.endsWith("qt")) return Number(s.slice(0, -2)) * 1e15;
  if (s.endsWith("t"))  return Number(s.slice(0, -1)) * 1e12;
  if (s.endsWith("b"))  return Number(s.slice(0, -1)) * 1e9;
  if (s.endsWith("m"))  return Number(s.slice(0, -1)) * 1e6;
  if (s.endsWith("k"))  return Number(s.slice(0, -1)) * 1e3;
  return Number(s);
};

/* ===== BD DATE ===== */
const bdDate = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });

/* ===== ROLL ===== */
const roll = () => {
  const total = em.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const s of em) {
    if (r < s.weight) return s.emoji;
    r -= s.weight;
  }
  return em[0].emoji;
};

module.exports = {
  config: {
    name: "slots",
    aliases: ["slot"],
    version: "2.2.0",
    author: "Irfan Ahmmed",
    role: 0,
    category: "game",
    description: "🎰 Ultra Premium Stylish Slot Machine",
    guide: {
      en: "   {pn} <amount>: Spin the slot\n   {pn} info: View your stats\n   {pn} top: View leaderboard"
    }
  },

  onStart: async ({ event, args, message, usersData }) => {
    const { senderID } = event;
    const sub = (args[0] || "").toLowerCase();
    const today = bdDate();

    const user = await usersData.get(senderID) || {};
    const isPremium = user.data?.premium?.status === true;
    const dl = isPremium ? dp : dn;

    /* ===== INIT STATS ===== */
    let todayStats = user.data?.slotsToday || {};
    if (todayStats.date !== today) {
      todayStats = { date: today, play: 0, win: 0, lose: 0, winMoney: 0 };
    }

    let allStats = user.data?.slotsAll || { play: 0, win: 0 };

    /* ===== INFO ===== */
    if (sub === "info") {
      const rate = todayStats.play
        ? ((todayStats.win / todayStats.play) * 100).toFixed(1)
        : "0";

      return message.reply(
        `╔═══ 𝐒𝐋𝐎𝐓 𝐈𝐍𝐅𝐎 ═══╗\n` +
        `║ 👤 User: ${user.name || "User"}\n` +
        `║ 👑 Premium: ${isPremium ? "✅" : "❌"}\n` +
        `║ 🎯 Limit: ${dl}\n` +
        `╠══════════════════╣ 𝐓𝐎𝐃𝐀𝐘 ──────╮\n` +
        `║ 🎰 Played: ${todayStats.play}\n` +
        `║ 🎉 Wins: ${todayStats.win}\n` +
        `║ 📈 Rate: ${rate}%\n` +
        `║ 💰 Profit: ${fm(todayStats.winMoney)}\n` +
        `╚══════════════════╝`);
    }

    /* ===== TOP ===== */
    if (sub === "top") {
      const all = await usersData.getAll();
      const top = Object.values(all)
        .map(u => ({
          name: u.name || "Unknown",
          win: u.data?.slotsAll?.win || 0
        }))
        .sort((a, b) => b.win - a.win)
        .slice(0, 5);

      let msg = `╔═══ 𝐒𝐋𝐎𝐓 𝐓𝐎𝐏 ═══╗\n`;
      top.forEach((u, i) => {
        msg += `║ #${i + 1} ${u.name}: ${u.win} 🏆\n`;
      });
      msg += `╚══════════════════╝`;
      return message.reply(msg);
    }

    /* ===== BET ===== */
    const bet = parseBet(args[0]);
    if (!bet || isNaN(bet))
      return message.reply("╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ ⚠️ Invalid bet amount\n╚══════════════════╝");

    if (bet > mbet)
      return message.reply(`╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ 🚫 Max Bet: ${fm(mbet)}\n╚══════════════════╝`);

    if (todayStats.play >= dl)
      return message.reply(`╔═══ 𝐒𝐘𝐒𝐓𝐄𝐌 ═══╗\n║ ⛔ Daily limit reached\n╚══════════════════╝`);

    if (user.money < bet)
      return message.reply(`╔═══ 𝐄𝐑𝐑𝐎𝐑 ═══╗\n║ 💸 Need ${fm(bet - user.money)} more\n╚══════════════════╝`);

    /* ===== SPIN ===== */
    const s1 = roll();
    const s2 = roll();
    const s3 = roll();

    let win = -bet;
    let title = "☠️ 𝐋𝐎𝐒𝐒";

    if (s1 === s2 && s2 === s3 && s1 === "7️⃣") {
      win = bet * 10;
      title = "🔥 𝐌𝐄𝐆𝐀 𝐉𝐀𝐂𝐊𝐏𝐎𝐓";
    } else if (s1 === s2 && s2 === s3) {
      win = bet * 5;
      title = "💎 𝐁𝐈𝐆 𝐖𝐈𝐍";
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      win = bet * 2;
      title = "✨ 𝐖𝐈𝐍";
    }

    /* ===== UPDATE ===== */
    todayStats.play++;
    allStats.play++;

    if (win > 0) {
      todayStats.win++;
      todayStats.winMoney += win;
      allStats.win++;
    } else {
      todayStats.lose++;
    }

    const newBalance = user.money + win;

    await usersData.set(senderID, {
      money: newBalance,
      "data.slotsToday": todayStats,
      "data.slotsAll": allStats
    });

    return message.reply(
      `╔═══ 𝐒𝐋𝐎𝐓 𝐌𝐀𝐂𝐇𝐈𝐍𝐄 ═══╗\n` +
      `║  🎰  ${s1}  ║  ${s2}  ║  ${s3}  🎰  \n` +
      `╠══════════════════╣\n` +
      `║ 📢 Result: ${title}\n` +
      `║ 💰 ${win > 0 ? "+" : "-"}${fm(Math.abs(win))}\n` +
      `║ 💳 Balance: ${fm(newBalance)}\n` +
      `║ 🎯 Today: ${todayStats.play}/${dl}\n` +
      `╚══════════════════╝`);
  }
};
