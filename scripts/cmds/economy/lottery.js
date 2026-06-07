module.exports = {
  config: {
    name: "lottery",
    aliases: ["lotto", "jackpotgame"],
    version: "1.2.1",
    author: "Irfan Ahmmed",
    role: 0,
    usePrefix: true,
    category: "economy",
    shortDescription: "🎰 Buy a lottery ticket",
    longDescription: "Try your luck and win big money from lottery",
    guide: "{pn}lottery",
    cooldowns: 10
  },

  onStart: async function ({ event, message, usersData }) {
    const { senderID } = event;

    const TICKET_COST = 5000;
    const JACKPOT = 100000;

    const formatMoney = (n) =>
      n >= 1000000 ? (n / 1000000).toFixed(1) + "M" :
      n >= 1000 ? (n / 1000).toFixed(1) + "K" :
      n;

    const userData = await usersData.get(senderID);
    const balance = userData?.money || 0;

    if (balance < TICKET_COST) {
      return message.reply(
        `🎰 LOTTERY\n\n` +
        `❌ Not enough money\n` +
        `🎟 Ticket : ${formatMoney(TICKET_COST)}\n` +
        `💰 Balance: ${formatMoney(balance)}`
      );
    }

    const numbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * 10)
    );

    let prize = 0;
    let resultText = "❌ No luck";

    if (numbers[0] === numbers[1] && numbers[1] === numbers[2]) {
      prize = JACKPOT;
      resultText = "🎰 JACKPOT!";
    } else if (
      numbers[0] === numbers[1] ||
      numbers[1] === numbers[2] ||
      numbers[0] === numbers[2]
    ) {
      prize = 20000;
      resultText = "🔁 Double Match";
    } else if (numbers.includes(7)) {
      prize = 10000;
      resultText = "🍀 Lucky Seven";
    }

    const finalBalance = balance - TICKET_COST + prize;

    await usersData.set(senderID, {
      money: finalBalance
    });

    return message.reply(
      `🎰 LOTTERY RESULT\n\n` +
      `🔢 ${numbers.join(" | ")}\n\n` +
      `${resultText}\n` +
      (prize > 0 ? `💸 Won : ${formatMoney(prize)}\n` : ``) +
      `🎟 Cost: ${formatMoney(TICKET_COST)}\n` +
      `💰 Bal : ${formatMoney(finalBalance)}`
    );
  }
};