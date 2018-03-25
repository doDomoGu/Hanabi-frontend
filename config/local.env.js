'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"local"',
  AXIOS_BASEURL: '"http://localhost:8889/v1"'
})
