# OpenBar

## Setup

### Get dependencies

```bash
npm install
```

### Configure

Copy `conf-tmpl.js` into `conf.js` and fill up your own configuration values.

```js
module.exports = {
  BASE_URL: "", // No trailing slash
  FIREBASE_URL: "<YOUR_FIREBASE_URL>",
  TRANSLOADIT_KEY: "<YOUR_TRANSLOADIT_KEY>", // WARNING: Your key is exposed. Needs a server-side component to hide this.
  IFRAMELY_KEY: "<YOUR_IFRAMELY_KEY>"
};
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
