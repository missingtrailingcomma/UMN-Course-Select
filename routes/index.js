var express = require('express')
var router = express.Router()
var request = require('request')
var async = require('async')

router.get('/', function (req, res, next) {
  var fetch = function (file, callback) {
    request({
      url: file,
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        if (error) {
          callback(error)
        } else {
          callback(null, body)
        }
      }
    })
  }

  async.map(['http://courses-staging.umn.edu/campuses.json', 'http://courses-staging.umn.edu/terms.json'], fetch, function (err, results) {
    if (err) {
    } else {
      var campuses = results[0].campuses.map(function (item) {return item.campus_id})
      var terms = {}
      results[1].terms.map(function (item) {return item.term_id }).sort().map(function (item) {
        var year = item.substring(1, 3)
        var termMap = { 3: 'Spring', 5: 'Summer', 9: 'Fall' }
        var term = termMap[item[3]]
        terms[item] = term + ' 20' + year
      })
      var currentTermId = '1159'
      res.render('index', {
        title: 'Express',
        campuses: campuses,
        terms: terms,
        currentTermId: currentTermId
      })
    }
  })
})

module.exports = router
