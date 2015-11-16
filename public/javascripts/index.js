var showSubjects = function () {
  var campus = $('#campusSelect').val()
  var term_id = $('#termSelect').val()
  $('#subjectSelect').empty()
  var url = 'http://courses-staging.umn.edu/campuses/' + campus.toLowerCase() + '/terms/' + term_id + '/subjects.json'
  $.getJSON(url, function (results){
    var subjects = results.subjects.sort(function (a, b) {
      if (a.subject_id > b.subject_id) {
        return 1;
      }
      if (a.subject_id < b.subject_id) {
        return -1;
      }
      return 0;
    })
    for (var i in subjects) {
      var subject = subjects[i]
      $('#subjectSelect').append('<option value="' + subject.subject_id + '">' +  subject.subject_id + ' ' + subject.description +'</option>')
    }
  })
}

var showCourses = function () {
  var campus = $('#campusSelect').val()
  var term_id = $('#termSelect').val()
  var subject_id = $('#subjectSelect').val()
  var catalog_number = $('#levelRangeSelect').val()

  $('.courseData').empty()
  var url = 'http://courses.umn.edu/campuses/' + campus.toLowerCase() + '/terms/' + term_id + '/courses.json?q='
  catalog_number = catalog_number.split('-')
  if (catalog_number.length === 0) {
    $('#subjectSelect').val('1000')
    url += 'catalog_number>=1000,'
  } else if (catalog_number.length === 1 && Number(catalog_number[0])) {
    url += 'catalog_number=' + catalog_number[0] + ','
  } else if (catalog_number.length === 2 && Number(catalog_number[0]) && Number(catalog_number[1]) && Number(catalog_number[0]) <= Number(catalog_number[1])) {
    url += 'catalog_number>=' + catalog_number[0] + ',catalog_number<=' + catalog_number[1] + ','
  } else if (catalog_number.length === 2 && Number(catalog_number[0]) && catalog_number[1] === '') {
    url += 'catalog_number>=' + catalog_number[0] + ','
  } else {
    $('#levelRangeSelect').val('');
    return
  }
  url += 'subject_id=' + subject_id
  $.getJSON(url, function (results){
    var courses = results.courses
    for (var i in courses) {
      var course = courses[i]
      var courseIntro = '<div class="panel panel-info"><div class="panel-heading">' + subject_id + ' ' + course.catalog_number + ' ' + course.title + '</div><div class="panel-body"><dl class="col-sm-4"><dt>Offer Term</dt><dd>' + course.offer_frequency + '</dd><br><dt>Credits</dt><dd>'
      if (course.credits_minimum === course.credits_maximum) {
        courseIntro += course.credits_minimum
      } else {
        courseIntro += course.credits_minimum + ' to ' + course.credits_maximum
      }
      courseIntro += '</dd></dl><div class="col-sm-8"><header>Description</header><p>' + course.description + '</p></div></div></div>'
      $('.courseData').append(courseIntro)
    }
  })
}


$('#campusSelect').change(showSubjects);
$('#termSelect').change(showSubjects);
$('#courseSearch').click(showCourses);

$(function () {
  showSubjects();
});
