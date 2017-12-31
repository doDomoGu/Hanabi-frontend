'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"test"',
  AXIOS_BASEURL: '"http://testapi.hanabi8.com/v1"'
})
