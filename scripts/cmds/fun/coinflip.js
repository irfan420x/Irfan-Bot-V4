module.exports = {
  config: {
    name: "coinflip",
    aliases: ["cf"],
    version: "1.2",
    author: "Irfan Ahmmed",
    countDown: 3,
    role: 0,
    shortDescription: "Flip a coin and win coins",
    longDescription: "Bet coins on a coin flip: Heads (🪙) or Tails (⚡)",
    guide: "{pn} <bet amount> [h/t]"
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const bet = parseInt(args[0]);
      if (!bet || bet <= 0)
        return api.sendMessage(
          "❌ Enter a valid bet amount.",
          event.threadID,
          event.messageID
        );

      const user = await usersData.get(event.senderID);
      if (user.money < bet)
        return api.sendMessage(
          "❌ Not enough balance.",
          event.threadID,
          event.messageID
        );

      let choice = args[1]?.toLowerCase();
      if (!choice || !["h", "t", "heads", "tails"].includes(choice)) {
        choice = Math.random() < 0.5 ? "h" : "t";
      }

      const pick =
        choice === "h" || choice === "heads"
          ? "Heads 🪙"
          : "Tails ⚡";

      const outcomes = ["Heads 🪙", "Tails ⚡"];
      const result = outcomes[Math.floor(Math.random() * 2)];

      const oldBalance = user.money;
      let newBalance;
      let win = false;

      if (pick === result) {
        await usersData.addMoney(event.senderID, bet * 2);
        newBalance = oldBalance + bet * 2;
        win = true;
      } else {
        await usersData.addMoney(event.senderID, -bet);
        newBalance = oldBalance - bet;
        if (newBalance < 0) newBalance = 0;
      }

      const line = "";
      const msg =
`${line}
🎲  𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣
${line}
Your pick   : ${pick}
Result      : ${result}
${line}
Old balance : ${oldBalance}
${win ? `You won 💰 : ${bet * 2}` : `You lost 💵 : ${bet}`}
Current bal : ${newBalance} 💸
${line}`;

      return api.sendMessage(msg, event.threadID, event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage(
        "❌ Coinflip error occurred.",
        event.threadID,
        event.messageID
      );
    }
  },
};