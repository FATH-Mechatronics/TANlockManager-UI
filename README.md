# tanlockmanager-ui

> TANlockManager WebUI

[![Build Status](https://travis-ci.org/FATH-Mechatronics/TANlockManager-UI.svg?branch=master)](https://travis-ci.org/FATH-Mechatronics/TANlockManager-UI)

## Release Packages

Windows Files are Released in NSIS Install Packages containing a prebuild Version of this Repo and also a Service and Firewall granting process.

## General Function

The UI Will connect to the same URL but on Port 4343 (The Server Component).
Configuration of this API-BASE-URL is currently NOT possible, should be able to be configurable in the `nuxt.config.js`.

This Repo only contains the User UI and has no Functionality at all.
The Busines is completely handled in the `Server`

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Run Without Yarn in Production

```bash
# after building use the nuxt command to start the server
$ node node_modules/nuxt/bin/nuxt.js start
```
