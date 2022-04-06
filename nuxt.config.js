//import colors from 'vuetify/es5/util/colors'

//import path from 'path'
//import fs from 'fs'

import {version} from './package.json'

export default {
  ssr: false,
  target: 'static',
  server: {
    port: 4344,
    host: '0.0.0.0', // default: localhost,
    /*https: {
      key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    }*/
  },
  /*
  ** Env
   */
  env: {
    // apiBaseUrl: "https://123.123.123.123:4343/, // Overwrite API BaseURL,
    apiSecure: true, // Use HTTPs for API BaseURL (if not overwrite)
    // apiPort: 4343, // OverwriteAPI Port,


    appVersion: version,
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + 'TANlockManager',
    title: 'TANlockManager',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff'},
  /*
  ** Global CSS
  */
  css: [
      '~/static/css/mdi-font.css',
      '~/static/css/roboto-font.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/socket.io',
    '~/plugins/userProvider',
    `~/plugins/filters`
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/eslint-module
    //'@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true/*,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }*/
    },
    defaultAssets: false
  },
  /*
  ** Build configuration
  */
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
