(function () {
  var currentLat = null;
  var currentLon = null;

  $(function () {
    loadPreferencesFromCookies();
    navigator.geolocation.getCurrentPosition(function (position) {
      currentLat = position.coords.latitude;
      currentLon = position.coords.longitude;
      showLocation(currentLat, currentLon);
      updateWeatherForLatLon(currentLat, currentLon);
    });

    bindControls();
    updateWhatToWear();

    $("input[type=range]").change();
  });

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function savePreferencesToCookies() {
    setCookie("riderTemp", $("#rider-temp-slider").val(), 365);
    setCookie("riderWork", $("#rider-work-slider").val(), 365);
    setCookie("rideType", $("#ride-type").val(), 365);
    setCookie("rideDuration", $("#ride-duration-slider").val(), 365);
    setCookie("units", $('input[name="units"]:checked').val(), 365);
  }

  function loadPreferencesFromCookies() {
    var riderTemp = getCookie("riderTemp");
    var riderWork = getCookie("riderWork");
    var rideType = getCookie("rideType");
    var rideDuration = getCookie("rideDuration");
    var units = getCookie("units");
    if (riderTemp !== null) $("#rider-temp-slider").val(riderTemp);
    if (riderWork !== null) $("#rider-work-slider").val(riderWork);
    if (rideType !== null) $("#ride-type").val(rideType);
    if (rideDuration !== null) $("#ride-duration-slider").val(rideDuration);
    if (units !== null) {
      $('input[name="units"][value="' + units + '"]').prop("checked", true);
    }
  }

  function updateWeatherForLatLon(latitude, longitude) {
    var url = "https://api.weather.gov/points/" + latitude + "," + longitude;
    $.ajax({
      url: url,
      datatype: "jsonp",
      success: function (data) {
        updateWeatherForGridEndpoint(data.properties.forecastHourly);
      },
    });
  }

  function updateWeatherForGridEndpoint(endpoint) {
    $.ajax({
      url: endpoint,
      datatype: "jsonp",
      success: function (data) {
        var duration = parseInt($("#ride-duration-slider").val());
        var periods = data.properties.periods.slice(0, duration);
        
        // Get ranges for the ride duration
        var temps = periods.map(function(p) { return p.temperature; });
        var winds = periods.map(function(p) { return parseInt(p.windSpeed.replace(/\D/g, "")) || 0; });
        var precips = periods.map(function(p) { return p.probabilityOfPrecipitation.value || 0; });
        
        var minTemp = Math.min.apply(null, temps);
        var maxTemp = Math.max.apply(null, temps);
        var minWind = Math.min.apply(null, winds);
        var maxWind = Math.max.apply(null, winds);
        var minPrecip = Math.min.apply(null, precips);
        var maxPrecip = Math.max.apply(null, precips);
        
        updateWeatherForData(minTemp, maxTemp, minWind, maxWind, minPrecip, maxPrecip);
      },
    });
  }

  function updateWeatherForData(
    minTemp,
    maxTemp,
    minWind,
    maxWind,
    minPrecip,
    maxPrecip
  ) {
    $("#temperature-slider-min").val(minTemp);
    $("#temperature-slider-max").val(maxTemp);
    $("#temperature-slider-min").change();

    $("#wind-slider-min").val(minWind);
    $("#wind-slider-max").val(maxWind);
    $("#wind-slider-min").change();

    $("#precipitation-slider-min").val(minPrecip);
    $("#precipitation-slider-max").val(maxPrecip);
    $("#precipitation-slider-min").change();
  }

  function showLocation(latitude, longitude) {
    $("#location-name").text(latitude + "," + longitude);
    $("#location-name").show();
  }

  function bindControls() {
    // Temperature range slider
    $("#temperature-slider-min, #temperature-slider-max").on("input change", function () {
      var min = parseInt($("#temperature-slider-min").val());
      var max = parseInt($("#temperature-slider-max").val());
      
      // Ensure min doesn't exceed max
      if (min > max) {
        if (this.id === "temperature-slider-min") {
          $("#temperature-slider-min").val(max);
          min = max;
        } else {
          $("#temperature-slider-max").val(min);
          max = min;
        }
      }
      
      if (min === max) {
        $("#temperature-label").text(displayTemperature(min));
      } else {
        $("#temperature-label").text(displayTemperatureRange(min, max));
      }
    });
    $("#temperature-slider-min").trigger("input");

    // Wind range slider
    $("#wind-slider-min, #wind-slider-max").on("input change", function () {
      var min = parseInt($("#wind-slider-min").val());
      var max = parseInt($("#wind-slider-max").val());
      
      // Ensure min doesn't exceed max
      if (min > max) {
        if (this.id === "wind-slider-min") {
          $("#wind-slider-min").val(max);
          min = max;
        } else {
          $("#wind-slider-max").val(min);
          max = min;
        }
      }
      
      if (min === max) {
        $("#wind-label").text(displayWind(min));
      } else {
        $("#wind-label").text(displayWindRange(min, max));
      }
    });
    $("#wind-slider-min").trigger("input");

    // Precipitation range slider
    $("#precipitation-slider-min, #precipitation-slider-max").on("input change", function () {
      var min = parseInt($("#precipitation-slider-min").val());
      var max = parseInt($("#precipitation-slider-max").val());
      
      // Ensure min doesn't exceed max
      if (min > max) {
        if (this.id === "precipitation-slider-min") {
          $("#precipitation-slider-min").val(max);
          min = max;
        } else {
          $("#precipitation-slider-max").val(min);
          max = min;
        }
      }
      
      if (min === max) {
        $("#precipitation-label").text(min + "% Chance");
      } else {
        $("#precipitation-label").text(min + " - " + max + "% Chance");
      }
    });
    $("#precipitation-slider-min").trigger("input");

    $("#rider-temp-slider").on("input change", function () {
      $("#rider-temp-label").text(riderTemp());
      savePreferencesToCookies();
    });
    $("#rider-temp-slider").trigger("input");

    $("#rider-work-slider").on("input change", function () {
      $("#rider-work-label").text(riderWork());
      savePreferencesToCookies();
    });
    $("#rider-work-slider").trigger("input");

    $("#ride-duration-slider").on("input change", function () {
      var hours = $("#ride-duration-slider").val();
      $("#ride-duration-label").text(hours + (hours === "1" ? " hour" : " hours"));
      savePreferencesToCookies();
      // Refresh weather forecast when duration changes
      if (currentLat !== null && currentLon !== null) {
        updateWeatherForLatLon(currentLat, currentLon);
      }
    });
    $("#ride-duration-slider").trigger("input");

    $("#ride-type").on("change", function () {
      savePreferencesToCookies();
    });

    $("input[type=range]").on("input change", updateWhatToWear);
    $("input[type=range]").on("input change", updateBackground);
    $("select, input[type=radio]").on("change", function () {
      updateWhatToWear();
      $("#temperature-slider-min").trigger("input");
      $("#wind-slider-min").trigger("input");
      $("#precipitation-slider-min").trigger("input");
      savePreferencesToCookies();
    });
  }

  function riderTemp() {
    switch ($("#rider-temp-slider").val()) {
      case "0":
        return "Cool";
      case "1":
        return "Neutral";
      case "2":
        return "Warm";
    }
  }

  function riderWork() {
    switch ($("#rider-work-slider").val()) {
      case "0":
        return "Easy";
      case "1":
        return "Medium";
      case "2":
        return "Hard";
    }
  }

  function temperature() {
    return parseFloat($("#temperature-slider-min").val());
  }

  function windModifier() {
    return -0.25 * parseFloat($("#wind-slider-max").val());
  }

  function precipitationModifier() {
    return -0.05 * parseFloat($("#precipitation-slider-max").val());
  }

  function riderTempModifier() {
    return -6 * parseFloat($("#rider-temp-slider").val());
  }

  function riderWorkModifier() {
    return 6 * parseFloat($("#rider-work-slider").val());
  }

  function rideTypeModifier() {
    return 3 * parseFloat($("#ride-type").val());
  }

  function effectiveTemperature() {
    return (
      temperature() +
      windModifier() +
      precipitationModifier() +
      riderTempModifier() +
      riderWorkModifier() +
      rideTypeModifier()
    );
  }

  function updateWhatToWear() {
    updateHead();
    updateTopHalf();
    updateArms();
    updateHands();
    updateBottomHalf();
    updateFeet();
    updateLayerNotice();
  }

  function updateLayerNotice() {
    var minTemp = parseInt($("#temperature-slider-min").val());
    var maxTemp = parseInt($("#temperature-slider-max").val());
    var tempRange = maxTemp - minTemp;
    
    if (tempRange > 8) {
      $("#layer-notice").show();
    } else {
      $("#layer-notice").hide();
    }
  }

  function updateHead() {
    var head = "Helmet, Glasses, and maybe a cycling cap";
    if (effectiveTemperature() <= 65) {
      head = "Helmet, Glasses, and a cycling cap";
    }
    if (effectiveTemperature() <= 53) {
      head = "Helmet, Glasses, a cycling cap or thin fleece/windstop beanie";
    }
    if (effectiveTemperature() <= 40) {
      head =
        "Helmet, Glasses, a cycling cap or thin fleece/windstop beanie, and some sort of scarf thing";
    }
    $("#wear-head").text(head);
  }

  function updateTopHalf() {
    var topHalf = "Short sleeve jersey";
    if (effectiveTemperature() <= 56) {
      topHalf = "Jersey w/base layer or wind vest";
    }
    if (effectiveTemperature() <= 46) {
      topHalf = "Jersey w/light baselayer and/or wind jacket";
    }
    if (effectiveTemperature() <= 36) {
      topHalf = "Jersey w/light baselayer and insulated jacket";
    }
    $("#wear-top").text(topHalf);
  }

  function updateArms() {
    var arms = "Apply sunscreen";
    if (effectiveTemperature() <= 63) {
      arms = "Arm warmers (if not covered)";
    }
    if (effectiveTemperature() <= 38) {
      arms = "Arm warmers and other layer(s) on top";
    }
    $("#wear-arms").text(arms);
  }

  function updateHands() {
    var hands = "Apply sunscreen, maybe gloves if that is your style";
    if (effectiveTemperature() <= 65) {
      hands = "Light gloves";
    }
    if (effectiveTemperature() <= 55) {
      hands = "Fullfinger warm gloves";
    }
    if (effectiveTemperature() <= 40) {
      hands = "Heavy gloves or Windstop gloves with liners";
    }
    if (effectiveTemperature() <= 25) {
      hands = "Crazy lobster glove setup";
    }
    $("#wear-hands").text(hands);
  }

  function updateBottomHalf() {
    var bottomHalf = "Bib shorts";
    if (effectiveTemperature() <= 58) {
      bottomHalf =
        "Bib knickers or bib shorts w/knee warmers or maybe just some embro";
    }
    if (effectiveTemperature() <= 46) {
      bottomHalf = "Bib tights, bib shorts w/leg warmers, embro, etc";
    }
    if (effectiveTemperature() <= 35) {
      bottomHalf = "Thick bib tights and perhaps a layer on top of that";
    }
    $("#wear-bottom").text(bottomHalf);
  }

  function updateFeet() {
    var feet = "(wool) Socks and cycling shoes";
    if (effectiveTemperature() >= 73) {
      feet = "Thin (wool) socks and cycling shoes";
    }
    if (effectiveTemperature() <= 53) {
      feet =
        "Wool socks and cycling shoes, toe covers if your shoes breathe well";
    }
    if (effectiveTemperature() <= 43) {
      feet = "Wool socks and cycling shoes and toe covers";
    }
    if (effectiveTemperature() <= 33) {
      feet = "Wool socks and cycling shoes and shoe covers";
    }
    $("#wear-feet").text(feet);
  }

  function updateBackground() {
    var currentPercentage =
      (($(this).val() - $(this).attr("min")) /
        ($(this).attr("max") - $(this).attr("min"))) *
      100;
    $(this).css(
      "background",
      "linear-gradient(to right, #ddd " +
        currentPercentage +
        "%, #fff " +
        currentPercentage +
        "%)"
    );
  }

  function isMetric() {
    return $('input[name="units"]:checked').val() === "metric";
  }

  function displayTemperature(tempF) {
    if (isMetric()) {
      return Math.round(((tempF - 32) * 5) / 9) + " C";
    }
    return tempF + " F";
  }

  function displayTemperatureRange(minTempF, maxTempF) {
    if (isMetric()) {
      var minC = Math.round(((minTempF - 32) * 5) / 9);
      var maxC = Math.round(((maxTempF - 32) * 5) / 9);
      return minC + " - " + maxC + " C";
    }
    return minTempF + " - " + maxTempF + " F";
  }

  function displayWind(windMph) {
    if (isMetric()) {
      return Math.round(windMph * 1.60934) + " km/h";
    }
    return windMph + " MPH";
  }

  function displayWindRange(minMph, maxMph) {
    if (isMetric()) {
      var minKmh = Math.round(minMph * 1.60934);
      var maxKmh = Math.round(maxMph * 1.60934);
      return minKmh + " - " + maxKmh + " km/h";
    }
    return minMph + " - " + maxMph + " MPH";
  }
})();
