$(function() {
  bindSliders();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeather);
  }
})

getWeather = function(position) {
  var API_KEY = "6d29cacc6a66711f8d1f46e88e377e19";
  var url = "https://api.forecast.io/forecast/" + API_KEY + "/" +
    position.coords.latitude + "," + position.coords.longitude;
  $.ajax({
    url: url,
    dataType: "jsonp",
    success: function(data) {
      temperature = Math.round(data.currently.temperature);
      console.log("Updating temperature to ", temperature);
      $('#temperature-slider').val(temperature);
      $('#temperature-slider').change();

      windSpeed = Math.round(data.currently.windSpeed);
      console.log("Updating wind speed to ", windSpeed);
      $('#wind-slider').val(windSpeed);
      $('#wind-slider').change();
    }
  });
}

bindSliders = function() {
  $('#temperature-slider').on('change mousemove', function() {
    $('#temperature-label').text($('#temperature-slider').val() + " F");
  });
  $('#temperature-slider').change();

  $('#wind-slider').on('change mousemove', function() {
    $('#wind-label').text($('#wind-slider').val() + " MPH");
  });
  $('#wind-slider').change();

  $('#conditions-slider').on('change mousemove', function() {
    var condition = ""
    switch($('#conditions-slider').val()) {
      case "0":
        condition = "Sunny";
        break;
      case "1":
        condition = "Overcast";
        break;
      case "2":
        condition = "Rainy";
        break;
      case "3":
        condition = "Wintery Percipitation";
        break;
    }
    $('#conditions-label').text(condition);
  });
  $('#conditions-slider').change();

  $('#rider-temp-slider').on('change mousemove', function() {
    var condition = ""
    switch($('#rider-temp-slider').val()) {
      case "0":
        condition = "Cool";
        break;
      case "1":
        condition = "Neutral";
        break;
      case "2":
        condition = "Warm";
        break;
    }
    $('#rider-temp-label').text(condition);
  });
  $('#rider-temp-slider').change();

  $('#rider-work-slider').on('change mousemove', function() {
    var condition = ""
    switch($('#rider-work-slider').val()) {
      case "0":
        condition = "Easy";
        break;
      case "1":
        condition = "Medium";
        break;
      case "2":
        condition = "Hard";
        break;
    }
    $('#rider-work-label').text(condition);
  });
  $('#rider-work-slider').change();
}
