# Modc App Store

Community-submitted apps for [My Own Data Center](https://github.com/MyOwnDataCenter/server).

The [official App Store](https://github.com/MyOwnDataCenter/app-store) is packaged and tested by the
project. **Modc is where anyone can submit an app** they find useful, including apps they did not
create. Submissions are checked automatically and reviewed before they're merged. Apps that prove
themselves here can move to the official store.

## Add this store to your server

In My Own Data Center: **App Store › Stores**, then **Add** next to Modc under Suggested. Or paste
`https://github.com/MyOwnDataCenter/Modc-app-store` under **Add by link**. Only the server's owner can add a store.

Community apps aren't tested as closely as the official store's. Like every app, they run as you, not as root, and
My Own Data Center lists any extra access an app asks for (the server's network, a device, a folder) and installs it
only after you allow it.

## Submit an app

There are two ways:

* **Open a pull request** with the app's two files. This is the fastest way.
  [CONTRIBUTING.md](CONTRIBUTING.md) shows what goes in them and how to test on your own server first.
* **Fill in the form**: [Submit an app](https://github.com/MyOwnDataCenter/Modc-app-store/issues/new?template=submit-app.yml).
  Tell us the app, its image and its port, and someone will package it or help you open the pull request.

## What gets in

Every app here:

* is one folder named after its `id`, with a `docker-compose.yml` and an `omarchy-app.yml`;
* uses a published image, pinned to a version, never `latest` and never built from source on the server.
  That image may be the project's official one, or one you built and published so people can run an app
  that has none;
* keeps its data under `${APP_DATA_DIR}`, and explains any other access in `extraAccess:`;
* never gets the container engine itself (`docker.sock`). Apps that manage containers belong in the official store;
* doesn't reuse an id or a port from the official store, or from another app here;
* says who made it (`developer`, `website`, `repo`) and who submitted it (`submitter`).

`npm ci`, then `npm run validate`, checks all of that. GitHub runs the same check on every pull request.

## How review works

Nothing is live until a maintainer approves it.

1. Your pull request is labelled **pending review**, and a comment gives you a link to try it on your own server.
2. The checks must pass.
3. A maintainer reads the files, installs the app on a test server from your pull request, and then either
   **approves** it (it's merged and live in every App Store within the hour), **asks for changes**, or
   **declines** it with the reason. You're thanked and told why either way.

Apps that stay healthy and are widely used are offered a move to the official store, with your credit kept in the
listing. Maintainers: see [REVIEWING.md](REVIEWING.md).

## Removing an app

If an app stops working, its image disappears, or a security problem is found, it's removed here. Servers keep
running copies already installed. To report a problem with an app, [open an issue](https://github.com/MyOwnDataCenter/Modc-app-store/issues/new).

## Who may change these guidelines

Changes to this README, [CONTRIBUTING.md](CONTRIBUTING.md), [REVIEWING.md](REVIEWING.md), and the review
workflow can be approved only by the founder and co-founders: Chris (ontheliftai), Joe (Called To Construct),
and Fred (NixFred). See [CONTRIBUTING.md](CONTRIBUTING.md#who-may-change-these-guidelines).
