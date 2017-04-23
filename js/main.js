var $ = window.$

// reservation form
function clickTable (evt) {
  var currentlySelectedTable = $('.selected')
  currentlySelectedTable.removeClass('selected')
  var $clickedEl = $(evt.currentTarget)
  $clickedEl.addClass('selected')
}

$('#tableContainer').on('click', '.table', clickTable)

/* Flickr API for all photos */
var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=188843a1a5f0b6cd12b9346dc0f9cc81&text=grill+mongolian&per_page=1000&format=json&nojsoncallback=1'
$.getJSON(flickrAPI).done(getFlickrData).fail(function (e) {
  console.log('There was an error. Try again.', e)
})

function getFlickrData (data) {
  // console.log(data)
  // var randomIndex = Math.floor(Math.random() * 500)
  // console.log(randomIndex)
  placeImage(data, 224, '#mainImg')
  placeImage(data, 384, '#dailySpecialImg')
  placeImage(data, 90, '#rightPhoto1')
  placeImage(data, 7, '#rightPhoto2')
  placeImage(data, 160, '#rightPhoto3')
}

function placeImage (data, num, imgEl) {
  var id = data.photos.photo[num].id
  var secret = data.photos.photo[num].secret
  var server = data.photos.photo[num].server
  var farm = data.photos.photo[num].farm

  var imgUrl = 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg'
  $(imgEl).attr('src', imgUrl)
}

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
START of Latest News Box (Andrew)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function fetchNewsSuccess (data) {
  $('#newsHead').html(data.title)
  $('#newsDate').html(data.date_published)
  $('#newsContent').html(data.post)
}

function fetchNewsError (err) {
  $('#newsContent').html('No news available', err)
}

var newsUrl = 'https://json-data.herokuapp.com/restaurant/news/1'

function fetchNews () {
  $.ajax(newsUrl, {
    error: fetchNewsError,
    success: fetchNewsSuccess,
    type: 'GET'
  })
}

fetchNews()

/* Tabs area to show 'About Subedei', 'Mongol Menu', or 'Reservations' */
var $menuBody = $('#menuBody')
$menuBody.hide()
var $reservationsBody = $('#reservationsBody')
$reservationsBody.hide()
var $aboutSubedeiBody = $('#aboutSubedeiBody')

$('#aboutSubedeiTab').on('click', function () {
  $aboutSubedeiBody.show()
  $menuBody.hide()
  $reservationsBody.hide()
})

$('#menuTab').on('click', function () {
  $aboutSubedeiBody.hide()
  $menuBody.show()
  $reservationsBody.hide()
})

$('#reservationsTab').on('click', function () {
  $aboutSubedeiBody.hide()
  $menuBody.hide()
  $reservationsBody.show()
})
