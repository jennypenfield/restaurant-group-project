var $ = window.$

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* SELECT A TABLE IN THE RESERVATION FORM */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function clickTable (evt) {
  var currentlySelectedTable = $('.selected')
  currentlySelectedTable.removeClass('selected')
  var $clickedEl = $(evt.currentTarget)
  $clickedEl.addClass('selected')
}

$('#tableContainer').on('click', '.table', clickTable)

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* GET PHOTOS FROM FLICKR API */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=8d779e2ab6bce146731dc0bb3dc373eb&text=mongolian+grill&format=json&nojsoncallback=1'
$.getJSON(flickrAPI).done(passFlickrData).fail(function failureSetImage (_err) {
  $('#mainImg').attr('src', 'https://farm4.staticflickr.com/3753/33361450580_88331dd197.jpg')
  $('#dailySpecialImg').attr('src', 'https://farm1.staticflickr.com/676/33899434605_e7e5454afb.jpg')
  $('#rightPhoto1').attr('src', 'https://farm9.staticflickr.com/8618/16139744063_5ede744187.jpg')
  $('#rightPhoto2').attr('src', 'https://farm1.staticflickr.com/587/20502538449_cd99858b80.jpg')
  $('#rightPhoto3').attr('src', 'https://farm8.staticflickr.com/7594/16758524731_81c06b90c8.jpg')
})

function passFlickrData (data) {
  /* Set the following photo index number from 'photo' array within flickr api object */
  var MAIN_IMG_INDEX = 2
  var DAILY_SPECIAL_INDEX = 1
  var RIGHT_PHOTO1_INDEX = 91
  var RIGHT_PHOTO2_INDEX = 59
  var RIGHT_PHOTO3_INDEX = 90

  assignImage(data, MAIN_IMG_INDEX, '#mainImg')
  assignImage(data, DAILY_SPECIAL_INDEX, '#dailySpecialImg')
  assignImage(data, RIGHT_PHOTO1_INDEX, '#rightPhoto1')
  assignImage(data, RIGHT_PHOTO2_INDEX, '#rightPhoto2')
  assignImage(data, RIGHT_PHOTO3_INDEX, '#rightPhoto3')
}

function assignImage (data, photoNum, imgEl) {
  var id = data.photos.photo[photoNum].id
  var secret = data.photos.photo[photoNum].secret
  var server = data.photos.photo[photoNum].server
  var farm = data.photos.photo[photoNum].farm

  var imgUrl = 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + '.jpg'
  $(imgEl).attr('src', imgUrl)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* GET LATEST NEWS FROM API */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
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

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* GENERATE MENU & DAILY SPECIAL FROM APIs */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var menuAPI = 'https://json-data.herokuapp.com/restaurant/menu/1'
$.getJSON(menuAPI).done(getMenuData).fail(function (e) {
  console.log('Cannot access menu API.', e)
})

function getMenuData (data) {
  for (var item in data) {
    if (data.hasOwnProperty(item)) {
      buildMenu(item, data[item])
      console.log(item, data[item])
    }
  }
}

function buildMenu (foodCourse, obj) {
  var foodCourseHeading = '<h2>' + foodCourse.charAt(0).toUpperCase() + foodCourse.slice(1) + '<h2>'
  $('#menuBody').append(foodCourseHeading)
  obj.forEach(function (index) {
    $('#menuBody').append(createMenuEntries(index))
  })
  getDailySpecial()
}

function createMenuEntries (eachFoodItem) {
  var menuItem = '<div id="' + eachFoodItem.id + '">' +
  '<p display:"inline"><strong>' + eachFoodItem.item + ' .......... $' + eachFoodItem.price + '</strong></p>' +
  '<p>' + eachFoodItem.description + '&nbsp;&nbsp;' +
  getAllergyStatus(eachFoodItem) + getFavoriteStatus(eachFoodItem) + getSpicyStatus(eachFoodItem) + getVeganStatus(eachFoodItem) + '</p></div>'
  return menuItem
}

function getAllergyStatus (foodItem) {
  if (foodItem.allergies === 1) {
    return '<i class="food-icons fa fa-exclamation"></i> '
  } else {
    return ''
  }
}

function getFavoriteStatus (foodItem) {
  if (foodItem.favorite === 1) {
    return '<i class="food-icons fa fa-star"></i> '
  } else {
    return ''
  }
}

function getSpicyStatus (foodItem) {
  if (foodItem.spicy === 1) {
    return '<i class="food-icons fa fa-flash"></i> '
  } else {
    return ''
  }
}

function getVeganStatus (foodItem) {
  if (foodItem.vegan === 1) {
    return '<i class="food-icons fa fa-heart"></i> '
  } else {
    return ''
  }
}

function getDailySpecial () {
  var dailySpecialAPI = 'https://json-data.herokuapp.com/restaurant/special/1'
  $.getJSON(dailySpecialAPI).done(showDailySpecial).fail(function (_err) {
    console.log('Cannot access daily special')
  })
}

function showDailySpecial (data) {
  var id = '#' + data.menu_item_id
  var dailySpecial = $(id)
  $('#dailySpecial').html(dailySpecial)
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* TABS FORM FOR ABOUT, MENU & RESERVATIONS */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* Default settings to show 'About' tab */
$('#aboutSubedeiBody').show()
$('#menuBody, #reservationsBody, #commentsReviewsBody').hide()

$('.tab-links').click(toggleTabs)
function toggleTabs (btn) {
  $('.tab-links').removeClass('active')
  $('#aboutSubedeiBody, #menuBody, #reservationsBody, #commentsReviewsBody').hide()
  $(this).addClass('active')
  var idName = '#' + btn.target.dataset.btn
  $(idName).show()
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* GOOGLE MAP */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

;(function () {
  var HOUSTON = {lat: 29.7604, lng: -95.2147}
  var DEFAULT_ZOOM_LEVEL = 8
  var DEFAULT_STARTING_PLACE = HOUSTON

  var mapEl = byId('map')
  var gmap = null
  var marker = null

  function initMap () {
    gmap = new google.maps.Map(mapEl, {
      zoom: DEFAULT_ZOOM_LEVEL,
      center: DEFAULT_STARTING_PLACE
    })
    marker = new google.maps.Marker({
      position: DEFAULT_STARTING_PLACE,
      map: gmap
    })
  }

  window.SUBEDEI = window.SUBEDEI || {}
  window.SUBEDEI.initGoogleMap = initMap

  function clickMapLocationBtn (evt) {
    var btnEl = evt.currentTarget
    var lat = parseFloat(btnEl.dataset.lat)
    var lng = parseFloat(btnEl.dataset.lng)
    var newLocation = {lat: lat, lng: lng}
    gmap.setCenter(newLocation)
    marker.setPosition(newLocation)
    marker.setAnimation(google.maps.Animation.DROP)
  }

  function addEvents () {
    $('.map-location-btn').click(clickMapLocationBtn)
  }

  function byId (id) {
    return document.getElementById(id)
  }

  addEvents()
})()

$('.map-location-btn').css('cursor', 'pointer')
