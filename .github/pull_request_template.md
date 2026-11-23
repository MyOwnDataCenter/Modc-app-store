<!-- Thanks for submitting an app! Fill this in and the checks will run on your pull request. -->

**App:** <!-- name and folder, e.g. Notes (notes/) -->
**Project:** <!-- the project's website or repository -->
**I am:** <!-- the app's developer / a user who packaged it -->

### Checklist
- [ ] One folder named after the app's `id`, with `docker-compose.yml` and `omarchy-app.yml`
- [ ] Every image is pinned to a version (`:1.4.2` or `@sha256:`), not `latest`
- [ ] Data is kept under `${APP_DATA_DIR}`; nothing else on the server is mounted unless explained in `extraAccess:`
- [ ] No access to the container engine (`docker.sock`)
- [ ] `npm run validate` passes
- [ ] I installed it on My Own Data Center (App Store › Stores › Add by link, with my fork's address) and it opened
- [ ] The app's license allows it to be listed here

### Anything a reviewer should know?
<!-- first-start time, default login, how to test it -->
