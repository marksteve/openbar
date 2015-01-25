# OpenBar

## Setup

Copy `src/jsx/conf-tmpl.js` into `src/jsx/conf.js` and fill up your
own configuration values.

### Firebase Rules

Put this in your rules section of your Firebase configuration.

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
