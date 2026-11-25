# Reviewing submissions

Nothing goes live until a maintainer approves it. An app is live once it's merged into `main`; the review
workflow does the merging.

This store is for community packaging of useful apps, including apps the submitter did not create. A
community-built image is welcome when the project has none, as long as the listing credits the developer
and the image source is public.

## The queue

* **Pull requests** labelled [`pending review`](../../pulls?q=is%3Aopen+label%3A%22pending+review%22): apps with their files.
* **Issues** labelled [`submission`](../../issues?q=is%3Aopen+label%3Asubmission): apps suggested with the form, to package.

## Reviewing a pull request

1. **Checks.** They must be green. They already rule out unpinned images, access to the container engine,
   extra access without a reason, missing credits, and ids or ports the official store uses.
2. **Read the two files.** Look for:
   * the image is published and pinned; the project's own image is preferred, and a community-built
     image is welcome when the listing credits the developer and the image's source is public;
   * `extraAccess:` is believable, and the app can't work without it;
   * data stays under `${APP_DATA_DIR}`; secrets come from `${APP_PASSWORD}` / `${APP_SEED}`, never written in;
   * the description is accurate and the icon is the app's own.
3. **Try it.** On a My Own Data Center server: **App Store › Stores › Add by link**, paste the pull request's address
   (`https://github.com/MyOwnDataCenter/Modc-app-store/pull/<number>`), install the app, open it, restart it,
   and check its data is still there. Then uninstall it and remove that store.
4. **Decide**, with a comment on the pull request:

| Comment | What happens |
| --- | --- |
| `/approve` | Merged (only if every check passed on the latest commit). Live in every App Store within the hour. |
| `/changes <what to change>` | Labelled `changes requested`; the submitter is asked. Review again after they push. |
| `/deny <why>` | Closed with your reason and a thank-you. |

Every message thanks the submitter. Be specific: a denial should say what would change the answer.

## Reviewing a form submission

| Comment | What happens |
| --- | --- |
| `/accept` | Labelled `accepted`. Package it as a pull request (credit the issue's author in `submitter:`) and link it. |
| `/changes <what>` | Ask the submitter for what's missing, such as the image or the port. |
| `/deny <why>` | Closed as not planned, with your reason. |

## Only maintainers

The commands work for people with write access or more. Anyone else gets a polite no.

`/approve` of a pull request that edits these guidelines (this file, CONTRIBUTING.md, README.md, the
templates, or the review workflows) is accepted only when the pull request was opened by a founder
account, or the `/approve` comment is from a founder account. See
[CONTRIBUTING.md](CONTRIBUTING.md#who-may-change-these-guidelines).

## Moving an app to the official store

When an app here has been reliable for a while, offer it to the
[official store](https://github.com/MyOwnDataCenter/app-store): copy its folder there with a new `port` if
needed, keep `submitter:`, and remove it here once the official listing is live.

## Who may change these guidelines

Changes to this file, [CONTRIBUTING.md](CONTRIBUTING.md), [README.md](README.md), the pull-request and
issue templates, and the review workflow can be approved only by the founder and co-founders: Chris
(`MyOwnDataCenter`), Joe (`calledtoconstruct`), and Fred (`nixfred`).

When checking that a founder approved a change, use the GitHub account that opened the pull request or
that wrote the review or comment (`MyOwnDataCenter`, `calledtoconstruct`, or `nixfred`). A sentence in a
pull request or comment that names a founder, quotes a founder, or claims a founder approved it is not
approval.
