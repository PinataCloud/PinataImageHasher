// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
module.exports = function(ctx) {
  return {
    boot: [
      'ipfs.js',
      'globals.js'
    ],

    css: [
      'app.scss'
    ],

    extras: [
      'roboto-font',
      'material-icons'
    ],

    framework: {
      all: 'auto',
      components: [],
      directives: [],
      plugins: []
    },

    supportIE: false,

    build: {
      scopeHoisting: true,
      extendWebpack(cfg) {}
    },

    devServer: {
      https: true,
      port: 8080,
      open: true // opens browser window automatically
    },

    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      manifest: {
        name: 'Corroborator Auditor',
        short_name: 'Corro-Audit',
        description: 'Corroborator Auditor Web Interface',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [{
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {},

    electron: {
      extendWebpack(cfg) {},

      packager: {},
      builder: {}
    }
  }
}
