var $ = window.$

// reservation form
function clickTable (evt) {
  $('.selected').removeClass('.selected')
  var $clickedEl = $(evt.currentTarget)
  $clickedEl.addClass('selected')
}

$('#tableContainer').on('click', '.table', clickTable)

var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1800104bf8400142b341d84f76471c7a&text=mongolian+restaurant+noodles&format=json&nojsoncallback=1&api_sig=6fe5853584e79c18b7f630e1c43395f0'
$.getJSON(flickrAPI).done(getFlickrData).fail(function (e) {
  console.log('There was an error. Try again.', e)
})

function getFlickrData (data) {
  // console.log(data)
  var randomIndex = Math.floor(Math.random() * 100)
  console.log(randomIndex)
  placeImage(data, randomIndex, '#mainImg')
  placeImage(data, randomIndex, '#dailySpecialImg')
  placeImage(data, randomIndex, '#smallRestaurantPhoto')
  placeImage(data, randomIndex, '#rightPhoto1')
  placeImage(data, randomIndex, '#rightPhoto2')
  placeImage(data, randomIndex, '#rightPhoto3')
}

function placeImage (data, num, imgEl) {
  var id = data.photos.photo[num].id
  var secret = data.photos.photo[num].secret
  var server = data.photos.photo[num].server
  var farm = data.photos.photo[num].farm

  var imgUrl = 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg'
  $(imgEl).attr('src', imgUrl)
}
