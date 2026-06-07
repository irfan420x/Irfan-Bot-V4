# 🚀 Irfan-FCA — Advanced Facebook Chat API

<a href="https://www.npmjs.com/package/irfan-fca"><img alt="npm version" src="https://img.shields.io/npm/v/irfan-fca.svg?style=flat-square"></a>
<a href="https://www.npmjs.com/package/irfan-fca"><img src="https://img.shields.io/npm/dm/irfan-fca.svg?style=flat-square" alt="npm downloads"></a>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> 🔥 **Enhanced Facebook Chat API** — 58+ Methods, MQTT Real-time, Middleware System, Auto-save AppState

## ✨ Features

- 🚀 **58+ API Methods** — Complete Facebook Messenger automation
- 📡 **MQTT Real-time** — Instant message listening
- 🔧 **Middleware System** — Custom event processing
- 💾 **Auto-save AppState** — No repeated logins
- 🔐 **2FA Support** — Two-factor authentication ready
- 📱 **Multi-platform** — Works with pages and personal accounts
- 🛡️ **Anti-ban Protection** — Built-in rate limiting
- 🎨 **Rich Media** — Send files, stickers, emojis, URLs

## 📦 Installation

```bash
# Stable version
npm install irfan-fca

# Bleeding edge (latest features)
npm install Irfan430/fca-unofficial
```

## 🚀 Quick Start

### Login with Email/Password
```javascript
const login = require('irfan-fca');

login({ 
    email: 'your@email.com', 
    password: 'your-password' 
}, (err, api) => {
    if (err) return console.error(err);
    
    console.log('✅ Logged in!');
    console.log('User ID:', api.getCurrentUserID());
    
    // Listen for messages
    api.listenMqtt((err, event) => {
        if (err) return console.error(err);
        
        if (event.type === 'message') {
            api.sendMessage('Echo: ' + event.body, event.threadID);
        }
    });
});
```

### Login with AppState (Recommended)
```javascript
const fs = require('fs');
const login = require('irfan-fca');

// Load saved session
const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));

login({ appState }, (err, api) => {
    if (err) return console.error(err);
    
    console.log('✅ Logged in with AppState!');
    
    // Your bot code here...
});
```

## 📚 Core Features

### 1️⃣ Send Messages
```javascript
// Text message
api.sendMessage('Hello!', threadID);

// Reply to message
api.sendMessage('Reply text', threadID, messageID);

// Send file
api.sendMessage({
    body: 'Here is the file',
    attachment: fs.createReadStream('./file.pdf')
}, threadID);

// Send image with caption
api.sendMessage({
    body: 'Check this out!',
    attachment: fs.createReadStream('./image.jpg')
}, threadID);

// Send URL
api.sendMessage({
    body: 'Cool link',
    url: 'https://example.com'
}, threadID);

// Send emoji
api.sendMessage({
    body: 'Great!',
    emoji: '👍',
    emojiSize: 'large'
}, threadID);
```

### 2️⃣ Profile Management
```javascript
// Set bio (NEW API)
api.setBio('My new bio text', (err, bioData) => {
    if (err) console.error(err);
    console.log('Bio set:', bioData);
});

// Change bio with options
api.setBio('Updated bio', { changeType: 'ADD' }, (err, bioData) => {
    console.log('Bio updated!');
});

// Delete bio
api.setBio('', { changeType: 'DELETE' }, (err) => {
    console.log('Bio deleted!');
});
```

### 3️⃣ Get Notifications (NEW API)
```javascript
api.getNotifications(20, (err, notifications) => {
    if (err) console.error(err);
    
    notifications.forEach(notif => {
        console.log(`${notif.text} - ${notif.timestamp}`);
    });
});
```

### 4️⃣ Get Groups List (NEW API)
```javascript
api.getGroupsList(50, (err, groups) => {
    if (err) console.error(err);
    
    groups.forEach(group => {
        console.log(`${group.name} (${group.memberCount} members)`);
    });
});
```

### 5️⃣ Get Pages List (NEW API)
```javascript
api.getPagesList(20, (err, pages) => {
    if (err) console.error(err);
    
    pages.forEach(page => {
        console.log(`${page.name} - ${page.fanCount} fans`);
    });
});
```

### 6️⃣ Get Stories (NEW API)
```javascript
api.getStories(30, (err, stories) => {
    if (err) console.error(err);
    
    stories.forEach(story => {
        console.log(`${story.owner.name}: ${story.url}`);
    });
});
```

### 7️⃣ Search Users (NEW API)
```javascript
api.searchUsers('John Doe', 10, (err, users) => {
    if (err) console.error(err);
    
    users.forEach(user => {
        console.log(`${user.name} - ${user.profileUrl}`);
    });
});
```

### 8️⃣ Get Marketplace (NEW API)
```javascript
api.getMarketplace(20, (err, listings) => {
    if (err) console.error(err);
    
    listings.forEach(item => {
        console.log(`${item.title} - $${item.price}`);
    });
});
```

### 9️⃣ Listen for Events
```javascript
api.listenMqtt((err, event) => {
    if (err) return console.error(err);
    
    switch (event.type) {
        case 'message':
            console.log('📩 Message:', event.body);
            console.log('👤 From:', event.senderID);
            console.log('💬 Thread:', event.threadID);
            break;
            
        case 'event':
            console.log('🎯 Event:', event);
            break;
            
        case 'typ':
            console.log('⌨️ Typing:', event.from);
            break;
            
        case 'read_receipt':
            console.log('👁️ Read by:', event.reader);
            break;
    }
});
```

### 3️⃣ Middleware System
```javascript
// Add middleware
api.useMiddleware('logger', (event, next) => {
    console.log(`[${event.senderID}]: ${event.body}`);
    next();
});

// Rate limiting middleware
api.useMiddleware('rateLimit', (event, next) => {
    // Track and limit messages per user
    next();
});

// Auto-reply middleware
api.useMiddleware('autoReply', (event, next) => {
    if (event.body === 'hello') {
        api.sendMessage('Hi there!', event.threadID);
    }
    next();
});
```

### 4️⃣ User & Thread Management
```javascript
// Get user info
api.getUserInfo(userID, (err, info) => {
    console.log(info[userID].name);
    console.log(info[userID].profileUrl);
});

// Get thread list
api.getThreadList(20, null, ['INBOX'], (err, threads) => {
    threads.forEach(thread => {
        console.log(thread.name, thread.threadID);
    });
});

// Get thread history
api.getThreadHistory(threadID, 50, null, (err, history) => {
    history.forEach(msg => {
        console.log(`[${msg.senderName}]: ${msg.body}`);
    });
});

// Search threads
api.searchForThread('Group Name', (err, threads) => {
    console.log(threads);
});
```

### 5️⃣ Group Management
```javascript
// Create group
api.createNewGroup([userID1, userID2], 'Group Name', (err, info) => {
    console.log('Group created:', info.threadID);
});

// Add user to group
api.addUserToGroup(userID, threadID, (err) => {
    console.log('User added!');
});

// Change group name
api.setTitle('New Name', threadID, (err) => {
    console.log('Title changed!');
});

// Change group color
api.changeThreadColor('#ffc300', threadID, (err) => {
    console.log('Color changed!');
});
```

### 6️⃣ Profile Management
```javascript
// Change profile picture
const stream = fs.createReadStream('new-photo.jpg');
api.changeAvatar(stream, (err, info) => {
    console.log('Avatar changed!');
    console.log('New URL:', info.profile.profilePhoto.url);
});

// Get current user ID
const myID = api.getCurrentUserID();
console.log('My ID:', myID);
```

## 🔧 Configuration

```javascript
api.setOptions({
    listenEvents: true,      // Listen to group events
    selfListen: false,       // Listen to own messages
    autoMarkRead: false,     // Auto mark as read
    online: true,            // Show online status
    logLevel: 'silent'       // silent/error/warn/info/verbose
});
```

## ⚠️ Important Notes

1. **AppState > Password** — Use AppState to reduce checkpoint/ban risk
2. **Rate Limiting** — Don't send messages too fast
3. **MQTT Required** — Call `listenMqtt()` before `sendMessage()`
4. **User-Agent** — Use Chrome 120+ for best compatibility

## 🐛 Troubleshooting

### "MQTT client is not initialized"
```javascript
// Start MQTT listener FIRST
api.listenMqtt((err, event) => { /* ... */ });

// Wait 5 seconds before sending
setTimeout(() => {
    api.sendMessage('Hello!', threadID);
}, 5000);
```

### "Login-approval" (2FA)
```javascript
login({ email, password }, (err, api) => {
    if (err && err.error === 'login-approval') {
        err.continue('123456'); // Your 2FA code
    }
});
```

## 📄 License

MIT License — See [LICENSE-MIT](LICENSE-MIT)

## 🙏 Credits

- Original: [Schmavery/facebook-chat-api](https://github.com/Schmavery/facebook-chat-api)
- Enhanced by: [DongDev](https://github.com/dongdev06)
- Modified by: [Irfan Ahmmed](https://github.com/Irfan430)

---

**Made with ❤️ by Irfan Ahmmed**
