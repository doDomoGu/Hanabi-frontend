'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  AXIOS_BASEURL: '"http://192.168.0.100:8889/v1"',
  host: "192.168.0.100"
})
