const fs = require("fs-extra");
const path = require("path");
const login = require("./fca-unofficial");

const appStatePath = path.join(__dirname, "ncstate.json");
const appState = JSON.parse(fs.readFileSync(appStatePath, "utf8"));

login({ appState }, (err, api) => {
    if (err) {
        console.error("❌ Login failed:", err.error || err.message);
        process.exit(1);
    }

    console.log("✅ Logged in! Bot ID:", api.getCurrentUserID());

    api.setOptions({ listenEvents: false, logLevel: "silent" });

    // Start MQTT
    api.listenMqtt(() => {});

    setTimeout(() => {
        // Test commands in Bot Test group
        const groupID = "8956129461140946";
        const commands = [
            ".help",
            ".ping",
            ".info",
            ".uptime",
            ".cmd",
            ".menu"
        ];

        let i = 0;
        function sendNext() {
            if (i >= commands.length) {
                console.log("\n✅ All commands sent!");
                setTimeout(() => process.exit(0), 3000);
                return;
            }
            const cmd = commands[i];
            console.log("📤 Sending: " + cmd);
            api.sendMessage(cmd, groupID, (err, info) => {
                if (err) console.error("❌ " + cmd + " failed:", err.message || err);
                else console.log("✅ " + cmd + " sent (ID: " + info.messageID + ")");
                i++;
                setTimeout(sendNext, 2000);
            });
        }

        sendNext();
    }, 5000);
});
