# Irfan-FCA — New APIs Usage Guide

## 📦 Installation

```bash
npm install irfan-fca@2.0.0
```

## 🚀 Quick Start

```javascript
const fs = require('fs');
const login = require('irfan-fca');

// Load AppState
const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));

login({ appState }, (err, api) => {
    if (err) return console.error(err);
    
    console.log('✅ Logged in!');
    
    // ========== NEW APIs ==========
    
    // 1. Set Bio
    api.setBio('My new bio text', (err, bioData) => {
        if (err) console.error(err);
        console.log('Bio set:', bioData);
    });
    
    // 2. Get Notifications
    api.getNotifications(20, (err, notifications) => {
        if (err) console.error(err);
        console.log('Notifications:', notifications);
    });
    
    // 3. Get Groups List
    api.getGroupsList(50, (err, groups) => {
        if (err) console.error(err);
        console.log('Groups:', groups);
    });
    
    // 4. Get Pages List
    api.getPagesList(20, (err, pages) => {
        if (err) console.error(err);
        console.log('Pages:', pages);
    });
    
    // 5. Get Stories
    api.getStories(30, (err, stories) => {
        if (err) console.error(err);
        console.log('Stories:', stories);
    });
    
    // 6. Search Users
    api.searchUsers('John Doe', 10, (err, users) => {
        if (err) console.error(err);
        console.log('Users:', users);
    });
    
    // 7. Get Marketplace
    api.getMarketplace(20, (err, listings) => {
        if (err) console.error(err);
        console.log('Marketplace:', listings);
    });
});
```

## 📋 Detailed Usage

### 1️⃣ Set Bio

```javascript
// Basic usage
api.setBio('Hello World!', (err, bioData) => {
    if (err) console.error(err);
    console.log('Bio set successfully!');
});

// With options
api.setBio('Updated bio', { changeType: 'ADD' }, (err, bioData) => {
    console.log('Bio:', bioData);
});

// Delete bio
api.setBio('', { changeType: 'DELETE' }, (err) => {
    console.log('Bio deleted!');
});

// Promise version
api.setBio('Promise bio').then(() => {
    console.log('Done!');
}).catch(err => {
    console.error(err);
});
```

### 2️⃣ Get Notifications

```javascript
// Get 20 notifications
api.getNotifications(20, (err, notifications) => {
    if (err) console.error(err);
    
    notifications.forEach(notif => {
        console.log(`ID: ${notif.id}`);
        console.log(`Text: ${notif.text}`);
        console.log(`Time: ${notif.timestamp}`);
        console.log(`Read: ${notif.isRead}`);
        console.log('---');
    });
});

// Promise version
api.getNotifications(50).then(notifications => {
    console.log('Got', notifications.length, 'notifications');
});
```

### 3️⃣ Get Groups List

```javascript
// Get 50 groups
api.getGroupsList(50, (err, groups) => {
    if (err) console.error(err);
    
    groups.forEach(group => {
        console.log(`Name: ${group.name}`);
        console.log(`ID: ${group.id}`);
        console.log(`Members: ${group.memberCount}`);
        console.log(`URL: ${group.url}`);
        console.log('---');
    });
});

// Promise version
api.getGroupsList(100).then(groups => {
    console.log('Found', groups.length, 'groups');
});
```

### 4️⃣ Get Pages List

```javascript
// Get 20 pages
api.getPagesList(20, (err, pages) => {
    if (err) console.error(err);
    
    pages.forEach(page => {
        console.log(`Name: ${page.name}`);
        console.log(`ID: ${page.id}`);
        console.log(`Fans: ${page.fanCount}`);
        console.log(`URL: ${page.url}`);
        console.log('---');
    });
});
```

### 5️⃣ Get Stories

```javascript
// Get 30 stories
api.getStories(30, (err, stories) => {
    if (err) console.error(err);
    
    stories.forEach(story => {
        console.log(`Owner: ${story.owner.name}`);
        console.log(`ID: ${story.id}`);
        console.log(`URL: ${story.url}`);
        console.log(`Time: ${story.timestamp}`);
        console.log('---');
    });
});
```

### 6️⃣ Search Users

```javascript
// Search for "John Doe"
api.searchUsers('John Doe', 10, (err, users) => {
    if (err) console.error(err);
    
    users.forEach(user => {
        console.log(`Name: ${user.name}`);
        console.log(`ID: ${user.id}`);
        console.log(`Profile: ${user.profileUrl}`);
        console.log(`Photo: ${user.thumbSrc}`);
        console.log(`Friend: ${user.isFriend}`);
        console.log('---');
    });
});
```

### 7️⃣ Get Marketplace

```javascript
// Get 20 listings
api.getMarketplace(20, (err, listings) => {
    if (err) console.error(err);
    
    listings.forEach(item => {
        console.log(`Title: ${item.title}`);
        console.log(`Price: $${item.price}`);
        console.log(`Location: ${item.location}`);
        console.log(`URL: ${item.url}`);
        console.log(`Image: ${item.imageUrl}`);
        console.log('---');
    });
});
```

## 🔄 Combining with Existing APIs

```javascript
const fs = require('fs');
const login = require('irfan-fca');

const appState = JSON.parse(fs.readFileSync('appstate.json', 'utf8'));

login({ appState }, (err, api) => {
    if (err) return console.error(err);
    
    // Get groups and send message to first one
    api.getGroupsList(1, (err, groups) => {
        if (err) return console.error(err);
        
        if (groups.length > 0) {
            api.sendMessage('Hello from new API!', groups[0].id);
        }
    });
    
    // Search user and get their info
    api.searchUsers('Mark', 1, (err, users) => {
        if (err) return console.error(err);
        
        if (users.length > 0) {
            api.getUserInfo(users[0].id, (err, info) => {
                console.log('User info:', info);
            });
        }
    });
    
    // Set bio and notify via message
    api.setBio('Updated via API!', (err) => {
        if (!err) {
            api.sendMessage('Bio updated!', 'THREAD_ID');
        }
    });
});
```

## ⚠️ Important Notes

1. **AppState Required** — Must have valid Facebook session
2. **Rate Limiting** — Don't call APIs too fast
3. **Callback OR Promise** — Both methods work
4. **Error Handling** — Always check for errors

## 📞 Support

- GitHub: https://github.com/irfan420x/fca-unofficial
- Issues: https://github.com/irfan420x/fca-unofficial/issues
