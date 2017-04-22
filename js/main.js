var $ = window.$

// reservation form
function clickTable (evt) {
  $('.selected').removeClass('.selected')
  var $clickedEl = $(evt.currentTarget)
  $clickedEl.addClass('selected')
}

$('#tableContainer').on('click', '.table', clickTable)

var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=393b9da4a2e761797b387b39cae61243&text=mongolian+restaurant+noodles&format=json&nojsoncallback=1&api_sig=b9ec9bcd35d39158746d766e7a5dfcaa'
$.get(flickrAPI).done(getFlickrData).fail(function (e) {
  console.log('There was an error. Try again.', e)
})

function getFlickrData (data) {
  console.log(data)
  var randomIndex = Math.floor(Math.random() * 128)
  placeImage(data, randomIndex, '#mainImg')
  placeImage(data, randomIndex, '#dailySpecial')
  placeImage(data, randomIndex, '#secondRestaurantPhoto')
  placeImage(data, randomIndex, '#rightPhoto1')
  placeImage(data, randomIndex, '#rightPhoto2')
  placeImage(data, randomIndex, '#rightPhoto3')
}

function placeImage (data, num, imgEl) {
  var id = data.photos.photo[num].id
  var secret = data.photos.photo[num].secret
  var server = data.photos.photo[num].server
  var farm = data.photos.photo[num].farm

  $('#mainImg').src('https://farm' + farm + '.staticflickr.com/' + id + '/' + server + '_' + secret + '.jpg')
}
