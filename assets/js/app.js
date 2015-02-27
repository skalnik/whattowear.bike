(function() {
  $(function() {
    bindSliders();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getWeather);
    }
  });

  function getWeather(position) {
    var API_KEY = "6d29cacc6a66711f8d1f46e88e377e19";
    var url = "https://api.forecast.io/forecast/" + API_KEY + "/" +
      position.coords.latitude + "," + position.coords.longitude;
    $.ajax({
      url: url,
      dataType: "jsonp",
      success: function(data) {
        var temperature = Math.round(data.currently.temperature);
        $('#temperature-slider').val(temperature);
        $('#temperature-slider').change();

        var windSpeed = Math.round(data.currently.windSpeed);
        $('#wind-slider').val(windSpeed);
        $('#wind-slider').change();

        var condition = data.currently.icon;
        var sunnyConditions = ['clear-day', 'clear-night', 'partly-cloudy-day', 'partly-cloudy-night', 'wind'];
        var overcastConditions = ['cloudy', 'fog'];
        var rainConditions = ['rain'];
        var winterConditions = ['snow', 'sleet'];

        if(sunnyConditions.indexOf(condition) != -1) {
          $('#conditions-slider').val(0);
        } else if (overcastConditions.indexOf(condition) != -1) {
          $('#conditions-slider').val(1);
        } else if (rainConditions.indexOf(condition) != -1) {
          $('#conditions-slider').val(2);
        } else if (winterConditions.indexOf(condition) != -1) {
          $('#conditions-slider').val(3);
        }
        $('#conditions-slider').change();

        getLocation(position);
      }
    });
  }

  function getLocation(position) {
    var API_KEY = "pk.eyJ1Ijoic2thbG5payIsImEiOiI0ZVo3TVRjIn0.emxWSobcWY9WekSuzN6iKg";
    var url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/" +
      position.coords.longitude + "," + position.coords.latitude +
      ".json?access_token=" + API_KEY;
    $.get(url, function(data) {
      $('p.location .location-name').text(data.features[0].place_name);
      $('p.location').show();
    });
  }

  function hideLocation() {
    $('p.location').hide();
  }

  function bindSliders() {
    $('#temperature-slider').on('change mousemove', function() {
      $('#temperature-label').text($('#temperature-slider').val() + " F");
    });
    $('#temperature-slider').change();

    $('#wind-slider').on('change mousemove', function() {
      $('#wind-label').text($('#wind-slider').val() + " MPH");
    });
    $('#wind-slider').change();

    $('#conditions-slider').on('change mousemove', function() {
      $('#conditions-label').text(conditions());
    });
    $('#conditions-slider').change();

    $('#rider-temp-slider').on('change mousemove', function() {
      $('#rider-temp-label').text(riderTemp());
    });
    $('#rider-temp-slider').change();

    $('#rider-work-slider').on('change mousemove', function() {
      $('#rider-work-label').text(riderWork());
    });
    $('#rider-work-slider').change();

    $('input[type=range]').on('change mousemove', updateWhatToWear);
    $('input[type=range]').on('change', hideLocation);
    $('input[type=radio]').on('change', function() {
      hideLocation();
      updateWhatToWear();
    });
    updateWhatToWear();
  }

  function conditions() {
    switch($('#conditions-slider').val()) {
      case "0":
        return "Sunny";
      case "1":
        return "Overcast";
      case "2":
        return "Rainy";
      case "3":
        return "Wintery Percipitation";
    }
  }

  function riderTemp() {
    switch($('#rider-temp-slider').val()) {
      case "0":
        return "Cool";
      case "1":
        return "Neutral";
      case "2":
        return "Warm";
    }
  }

  function riderWork() {
    switch($('#rider-work-slider').val()) {
      case "0":
        return "Easy";
      case "1":
        return "Medium";
      case "2":
        return "Hard";
    }
  }

  function rideType() {
    switch($('input:radio[name=ride-type]:checked').val()) {
      case "commute":
        return 0;
      case "mountain":
        return 1;
      case "road":
        return 2;
    }
  }

  function temperature() {
    return parseFloat($('#temperature-slider').val());
  }

  function windModifier() {
    return -0.25 * parseFloat($('#wind-slider').val());
  }

  function conditionsModifier() {
    return -5 * parseFloat($('#conditions-slider').val());
  }

  function riderTempModifier() {
    return -6 * parseFloat($('#rider-temp-slider').val());
  }

  function riderWorkModifier() {
    return 6 * parseFloat($('#rider-work-slider').val());
  }

  function rideTypeModifier() {
    return 3 * rideType();
  }


  function effectiveTemperature() {
    return temperature() + windModifier() + conditionsModifier() +
      riderTempModifier() + riderWorkModifier() + rideTypeModifier();
  }

  function updateWhatToWear() {
    updateHead();
    updateTopHalf();
    updateArms();
    updateHands();
    updateBottomHalf();
    updateFeet();
  }

  function updateHead() {
    var head = 'Helmet and maybe a cycling cap';
    if(effectiveTemperature() <= 65) { head = 'Helmet and a cycling cap' }
    if(effectiveTemperature() <= 40) { head = 'Helmet, a cycling cap, and some sort of scarf thing' }
    $('#wear-head').text(head);
  }

  function updateTopHalf() {
    var topHalf = 'Short sleeve jersey';
    if(effectiveTemperature() <= 55) { topHalf = 'Jersey w/base layer or wind vest' }
    if(effectiveTemperature() <= 45) { topHalf = 'Jersey w/light baselayer and/or wind jacket' }
    if(effectiveTemperature() <= 35) { topHalf = 'Jersey w/light baselayer and insulated jacket' }
    $('#wear-top').text(topHalf);
  }

  function updateArms() {
    var arms = 'Apply sunscreen';
    if(effectiveTemperature() <= 65) { arms = 'Arm warmers (if not covered)' }
    if(effectiveTemperature() <= 35) { arms = 'Arm warmers and other layer(s) on top' }
    $('#wear-arms').text(arms);
  }

  function updateHands() {
    var hands = 'Apply sunscreen';
    if(effectiveTemperature() <= 65) { hands = 'Light gloves' }
    if(effectiveTemperature() <= 55) { hands = 'Fullfinger warm gloves' }
    if(effectiveTemperature() <= 45) { hands = 'Heavy gloves' }
    if(effectiveTemperature() <= 35) { hands = 'Crazy lobster glove setup' }
    $('#wear-hands').text(hands);
  }

  function updateBottomHalf() {
    var bottomHalf = 'Bib shorts';
    if(effectiveTemperature() <= 55) { bottomHalf = 'Bib knickers or bib shorts w/knee warmers or may just some embro' }
    if(effectiveTemperature() <= 45) { bottomHalf = 'Bib tights, bib shorts w/leg warmers, embro, etc' }
    if(effectiveTemperature() <= 35) { bottomHalf = 'Thick bib tights and perhaps a layer on top of that' }
    $('#wear-bottom').text(bottomHalf);
  }

  function updateFeet() {
    var feet = 'Socks and cycling shoes';
    if (effectiveTemperature() >= 75) { feet = 'Thin socks and cycling shoes' };
    if (effectiveTemperature() <= 55) { feet = 'Wool socks and cycling shoes, maybe toe covers if your shoes breathe well' };
    if (effectiveTemperature() <= 45) { feet = 'Wool socks and cycling shoes and toe covers' };
    if (effectiveTemperature() <= 35) { feet = 'Wool socks and cycling shoes and shoe covers' };
    $('#wear-feet').text(feet);
  }
})();
