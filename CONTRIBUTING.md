# Submitting an app

Thanks for adding to the Modc App Store! An app is one folder with two files. This guide shows both, the rules,
and how to try your app on your own server before you open a pull request.

## 1. Make the folder

Pick an `id`: lowercase letters, numbers and dashes, such as `notes` or `field-notes`. It can't be one the
[official store](https://github.com/TouchWorkStation/app-store) already uses. Make a folder with that name:

```
notes/
  docker-compose.yml
  omarchy-app.yml
```

## 2. `docker-compose.yml`

A plain Docker Compose file. Omarchy Server fills in the `${...}` values when it installs the app.

```yaml
services:
  web:
    image: ghcr.io/someone/notes:2.3.1   # the project's own image, pinned to a version
    restart: unless-stopped
    environment:
      TZ: ${TZ}
      ADMIN_PASSWORD: ${APP_PASSWORD}     # a password made for this server, shown on the app's page
    volumes:
      - ${APP_DATA_DIR}/data:/data        # everything the app keeps goes under APP_DATA_DIR
```

You don't need a `ports:` section for the web page: Omarchy Server opens the port in `omarchy-app.yml` and puts
its own sign-in in front of the app. Add `ports:` only for something that isn't a web page, such as a sync
protocol, and list those ports in `openPorts:` (below).

### Values Omarchy Server fills in

| Value | What it is |
| --- | --- |
| `${APP_DATA_DIR}` | The app's own folder. Keep all its data under here; it's backed up with the server. |
| `${APP_PASSWORD}` | A password generated for this app on this server. Shown on the app's page when `deterministicPassword: true`. |
| `${APP_SEED}`, `${APP_SEED_32}` | A secret made for this app on this server, for keys and session secrets. |
| `${TZ}` | The server's time zone. |
| `${PUID}`, `${PGID}` | The user and group the app should run as, for images that ask for them. |
| `${SERVER_IP}`, `${DEVICE_DOMAIN_NAME}` | The server's address on your network. |
| `${DOWNLOADS_DIR}`, `${VIDEOS_DIR}`, `${MUSIC_DIR}`, `${PICTURES_DIR}`, `${DOCUMENTS_DIR}` | The person's own folders, for apps that work with them. |

## 3. `omarchy-app.yml`

The App Store listing.

```yaml
manifestVersion: 1
id: notes                      # must match the folder
name: "Notes"
tagline: "Quick notes that sync everywhere"
icon: https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/notes.png   # https, square, 256px or more
category: files                # files, media, photography, social, finance, automation, networking, developer, ai, gaming, crypto
version: "2.3.1"
port: 4310                     # the port it opens on: 1024–65535, not used by another app
web:                           # which service and container port is the web page
  service: web
  port: 8080
description: >-
  Notes keeps short notes in sync across your phone and computers.

  The first start takes a few seconds.
developer: "Someone"
website: https://notes.example.com
repo: https://github.com/someone/notes
submitter: "your-github-name"
# Optional:
deterministicPassword: true    # show ${APP_PASSWORD} on the app's page
defaultUsername: "admin"
# openPorts: ["22000/tcp"]     # extra ports the app opens, besides its web page
# extraAccess: "It needs the server's network to find devices on your home network."
```

### Extra access

If the app needs more than a plain container, say why in `extraAccess:`. People see your reason before they
install. That includes:

* `privileged: true`, `cap_add:`, or `security_opt` that turns confinement off;
* `network_mode: host`, or `pid`/`ipc: host`;
* `devices:`, such as a USB stick or a video card;
* a folder outside `${APP_DATA_DIR}` and the person's own folders.

Access to the container engine (`docker.sock`, `podman.sock`, `${DOCKER_SOCKET}`) isn't accepted here at all.

## 4. Check it

```
npm ci
npm run validate
```

It must say `0 errors`. The same check runs on your pull request, along with a check that your `id` and `port`
aren't already used by the official store.

## 5. Try it on your server

1. Push your branch to your fork.
2. In Omarchy Server (0.9.62 or newer), go to **App Store › Stores** and paste your branch's address under
   **Add by link**: `https://github.com/<you>/Modc-app-store/tree/<your-branch>`.
3. Install the app, open it, and check that it starts and keeps its data after **Restart**.
4. Uninstall it and remove that store again when you're done (**Stores › Remove**).

Once your pull request is open, its own address works the same way.

## 6. Open the pull request

Fill in the checklist. It's labelled **pending review**, and a maintainer reviews it, tries it, and approves it
(it goes live), asks for changes, or declines it with the reason. See [REVIEWING.md](REVIEWING.md) for what we
look at. Thanks for your submission!

## Can't write the files?

[Fill in the form](https://github.com/TouchWorkStation/Modc-app-store/issues/new?template=submit-app.yml)
instead, and someone will package it.
