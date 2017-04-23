var $ = window.$

// reservation form
function clickTable (evt) {
  $('.selected').removeClass('.selected')
  var $clickedEl = $(evt.currentTarget)
  $clickedEl.addClass('selected')
}

$('#tableContainer').on('click', '.table', clickTable)

var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1800104bf8400142b341d84f76471c7a&text=grill+mongolian&per_page=1000&format=json&nojsoncallback=1&api_sig=340b7e6535c957ff6522c97a2f0868f2'
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
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
START of Latest News Box (Andrew)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
function fetchNewsSuccess (data) {
  $('#newsHead').html(data.title)
  $('#newsDate').html(data.date_published)
  $('#newsContent').html(data.post)
}
function fetchNewsError (err) {
  $('#newsContent').html('No news available')
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
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
END of Latest News Box (Andrew)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
