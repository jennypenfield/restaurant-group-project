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

var flickrAPI = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=70c8af8f150221737b7487a43a27aebd&text=mongolian+grill&per_page=500&format=json&nojsoncallback=1&api_sig=b287c90cf38a76dad1776b6079935bf3'
$.getJSON(flickrAPI).done(passFlickrData).fail(function (_err) {
  console.log('There was an error getting the flickr API. Try again.')
})

function passFlickrData (data) {
  // console.log(data)
  // var randomIndex = Math.floor(Math.random() * 500)
  // console.log(randomIndex)
  assignImage(data, 224, '#mainImg')
  assignImage(data, 375, '#dailySpecialImg')
  assignImage(data, 90, '#rightPhoto1')
  assignImage(data, 98, '#rightPhoto2')
  assignImage(data, 160, '#rightPhoto3')
}

function assignImage (data, photoNum, imgEl) {
  console.log(data)
  var id = data.photos.photo[photoNum].id
  var secret = data.photos.photo[photoNum].secret
  var server = data.photos.photo[photoNum].server
  var farm = data.photos.photo[photoNum].farm

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

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* GENERATE MENU & DAILY SPECIAL FROM APIs */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

var menuAPI = 'https://json-data.herokuapp.com/restaurant/menu/1'
$.getJSON(menuAPI).done(getMenuData).fail(function (_err) {
  console.log('Cannot access menu API.')
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
  var menuItem = '<div id="' + eachFoodItem.id + '">' + '<p><strong>' + eachFoodItem.item + ' .......... $' + eachFoodItem.price + '</strong></p>' +
  '<p>' + eachFoodItem.description + '</p></div>'
  return menuItem
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

/* Starting state showing #menuBody section only with 'About Subedei' tab color #353238 */
var $menuBody = $('#menuBody')
var $reservationsBody = $('#reservationsBody')
var $aboutSubedeiBody = $('#aboutSubedeiBody')
$menuBody.hide()
$reservationsBody.hide()

var $aboutSubedeiTab = $('#aboutSubedeiTab')
var $menuTab = $('#menuTab')
var $reservationsTab = $('#reservationsTab')
$aboutSubedeiTab.css('color', '#353238')

/* Event listeners on tabs to show the section corresponding to the tab that was clicked */
$('#aboutSubedeiTab').on('click', function () {
  $aboutSubedeiBody.show()
  $aboutSubedeiTab.css('color', '#353238')
  $menuBody.hide()
  $menuTab.css('color', '#92140c')
  $reservationsBody.hide()
  $reservationsTab.css('color', '#92140c')
})

$('#menuTab').on('click', function () {
  $menuBody.show()
  $menuTab.css('color', '#353238')
  $aboutSubedeiBody.hide()
  $aboutSubedeiTab.css('color', '#92140c')
  $reservationsBody.hide()
  $reservationsTab.css('color', '#92140c')
})

$('#reservationsTab').on('click', function () {
  $reservationsBody.show()
  $reservationsTab.css('color', '#353238')
  $aboutSubedeiBody.hide()
  $aboutSubedeiTab.css('color', '#92140c')
  $menuBody.hide()
  $menuTab.css('color', '#92140c')
})
