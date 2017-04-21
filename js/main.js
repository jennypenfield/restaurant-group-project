var $ = window.$

function clickTable (evt) {
  var $clickedEl = $(evt.currentTarget)
  $clickedEl.toggleClass('selected')
}

$('#tableContainer').on('click', '.table', clickTable)
