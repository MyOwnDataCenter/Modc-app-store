# Modc App Store

Community-submitted apps for [Omarchy Server](https://github.com/TouchWorkStation/omarchy-server).

The [TouchWorkStation App Store](https://github.com/TouchWorkStation/app-store) is the official store: every app
there is packaged and tested by TouchWorkStation. **Modc is where anyone can submit an app.** Submissions are
checked automatically and reviewed before they're merged. Apps that prove themselves here can move to the official
store.

## Add this store to your server

In Omarchy Server: **App Store › Stores**, then **Add** next to Modc under Suggested. Or paste
`https://github.com/TouchWorkStation/Modc-app-store` under **Add by link**. Only the server's owner can add a store.

Community apps aren't tested as closely as the official store's. Like every app, they run as you, not as root, and
Omarchy Server lists any extra access an app asks for (the server's network, a device, a folder) and installs it
only after you allow it.

## Submit an app

There are two ways:

* **Open a pull request** with the app's two files. This is the fastest way.
  [CONTRIBUTING.md](CONTRIBUTING.md) shows what goes in them and how to test on your own server first.
* **Fill in the form**: [Submit an app](https://github.com/TouchWorkStation/Modc-app-store/issues/new?template=submit-app.yml).
  Tell us the app, its image and its port, and someone will package it or help you open the pull request.

## What gets in

Every app here:

* is one folder named after its `id`, with a `docker-compose.yml` and an `omarchy-app.yml`;
* uses the project's own published image, pinned to a version, never `latest` and never built from source;
* keeps its data under `${APP_DATA_DIR}`, and explains any other access in `extraAccess:`;
* never gets the container engine itself (`docker.sock`). Apps that manage containers belong in the official store;
* doesn't reuse an id or a port from the official store, or from another app here;
* says who made it (`developer`, `website`, `repo`) and who submitted it (`submitter`).

`npm ci`, then `npm run validate`, checks all of that. GitHub runs the same check on every pull request.

## How review works

1. Your pull request's checks must pass.
2. A maintainer reads the compose file and listing, installs the app on a test server, and opens it.
3. We'll comment with anything that needs changing, then merge. It appears in everyone's App Store within an hour, or
   right away with **Check for new apps** (the arrow at the top of the App Store).

Apps that stay healthy and are widely used are offered a move to the official store, with your credit kept in the
listing.

## Removing an app

If an app stops working, its image disappears, or a security problem is found, it's removed here. Servers keep
running copies already installed. To report a problem with an app, [open an issue](https://github.com/TouchWorkStation/Modc-app-store/issues/new).
