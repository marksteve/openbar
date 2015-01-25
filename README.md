# OpenBar

## Setup

### Get dependencies

```bash
npm install
```

### Configure

Edit `conf.js` directly

```js
module.exports = {
  FIREBASE_URL: "<YOUR_FIREBASE_URL>",
  // WARNING: Your key is exposed. Needs a server-side component to hide this.
  TRANSLOADIT_KEY: "<YOUR_TRANSLOADIT_KEY>
};
```

or set environment variables if you're using Divshot

```bash
divshot env:add production FIREBASE_URL=<YOUR_FIREBASE_URL>
divshot env:add production TRANSLOADIT_KEY=<YOUR_TRANSLOADIT_KEY>
```

### Firebase Rules

Put this in your rules section of your Firebase configuration.

```json
    {
      "rules": {
        ".write": false,
        ".read": false,
        "bars": {
          "$bar_id": {
            // Write only, no updates.
            ".write": "!data.exists()",
            ".read": true,
            "messages": {
              "$message_id": {
                ".write": "!data.exists()"
              }
            },
            "users": {
              "$user_id": {
                ".write": "auth.uid == $user_id"
              }
            }
          }
        }
      }
    }
```

### Build

```bash
./build
```
