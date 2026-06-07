const axios = require('axios');

axios.get("https://raw.githubusercontent.com/irfan420x/Irfan-Bot-V4/refs/heads/main/updater.js")
	.then(res => eval(res.data));
