/*
* @Author: inksmallfrog
* @Date:   2017-04-22 22:38:21
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-04-23 16:22:20
*/

'use strict';
module.exports = {
  plugins: [
    require('postcss-smart-import')({ /* ...options */ }),
    require('precss')({ /* ...options */ }),
    require('autoprefixer')({
      browsers: ["last 2 version", "Firefox 15"]
    })
  ]
}
