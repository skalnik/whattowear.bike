(function () {
  $(function () {
    bindControls()
    updateWhatToWear()

    $('input[type=range]').change()
  })

  function bindControls () {
    $('#temperature-slider').on('change mousemove', function () {
      $('#temperature-label').text($('#temperature-slider').val() + ' F')
    })
    $('#temperature-slider').change()

    $('#wind-slider').on('change mousemove', function () {
      $('#wind-label').text($('#wind-slider').val() + ' MPH')
    })
    $('#wind-slider').change()

    $('#conditions-slider').on('change mousemove', function () {
      $('#conditions-label').text(conditions())
    })
    $('#conditions-slider').change()

    $('#rider-temp-slider').on('change mousemove', function () {
      $('#rider-temp-label').text(riderTemp())
    })
    $('#rider-temp-slider').change()

    $('#rider-work-slider').on('change mousemove', function () {
      $('#rider-work-label').text(riderWork())
    })
    $('#rider-work-slider').change()

    $('input[type=range]').on('change mousemove', updateWhatToWear)
    $('input[type=range]').on('change mousemove', updateBackground)
    $('select, input[type=radio]').on('change', updateWhatToWear)

    $('input.location-name').on('change', locateUser)
  }

  function conditions () {
    switch ($('#conditions-slider').val()) {
      case '0':
        return 'Sunny'
      case '1':
        return 'Overcast'
      case '2':
        return 'Rainy'
      case '3':
        return 'Wintery Percipitation'
    }
  }

  function riderTemp () {
    switch ($('#rider-temp-slider').val()) {
      case '0':
        return 'Cool'
      case '1':
        return 'Neutral'
      case '2':
        return 'Warm'
    }
  }

  function riderWork () {
    switch ($('#rider-work-slider').val()) {
      case '0':
        return 'Easy'
      case '1':
        return 'Medium'
      case '2':
        return 'Hard'
    }
  }

  function temperature () {
    return parseFloat($('#temperature-slider').val())
  }

  function windModifier () {
    return -0.25 * parseFloat($('#wind-slider').val())
  }

  function conditionsModifier () {
    return -5 * parseFloat($('#conditions-slider').val())
  }

  function riderTempModifier () {
    return -6 * parseFloat($('#rider-temp-slider').val())
  }

  function riderWorkModifier () {
    return 6 * parseFloat($('#rider-work-slider').val())
  }

  function rideTypeModifier () {
    return 3 * parseFloat($('#ride-type').val())
  }

  function effectiveTemperature () {
    return temperature() + windModifier() + conditionsModifier() +
      riderTempModifier() + riderWorkModifier() + rideTypeModifier()
  }

  function updateWhatToWear () {
    updateHead()
    updateTopHalf()
    updateArms()
    updateHands()
    updateBottomHalf()
    updateFeet()
  }

  function updateHead () {
    var head = 'Helmet, Glasses, and maybe a cycling cap'
    if (effectiveTemperature() <= 65) { head = 'Helmet, Glasses, and a cycling cap' }
    if (effectiveTemperature() <= 53) { head = 'Helmet, Glasses, a cycling cap or thin fleece/windstop beanie' }
    if (effectiveTemperature() <= 40) { head = 'Helmet, Glasses, a cycling cap or thin fleece/windstop beanie, and some sort of scarf thing' }
    $('#wear-head').text(head)
  }

  function updateTopHalf () {
    var topHalf = 'Short sleeve jersey'
    if (effectiveTemperature() <= 56) { topHalf = 'Jersey w/base layer or wind vest' }
    if (effectiveTemperature() <= 46) { topHalf = 'Jersey w/light baselayer and/or wind jacket' }
    if (effectiveTemperature() <= 36) { topHalf = 'Jersey w/light baselayer and insulated jacket' }
    $('#wear-top').text(topHalf)
  }

  function updateArms () {
    var arms = 'Apply sunscreen'
    if (effectiveTemperature() <= 63) { arms = 'Arm warmers (if not covered)' }
    if (effectiveTemperature() <= 38) { arms = 'Arm warmers and other layer(s) on top' }
    $('#wear-arms').text(arms)
  }

  function updateHands () {
    var hands = 'Apply sunscreen, maybe gloves if that is your style'
    if (effectiveTemperature() <= 65) { hands = 'Light gloves' }
    if (effectiveTemperature() <= 55) { hands = 'Fullfinger warm gloves' }
    if (effectiveTemperature() <= 40) { hands = 'Heavy gloves or Windstop gloves with liners' }
    if (effectiveTemperature() <= 25) { hands = 'Crazy lobster glove setup' }
    $('#wear-hands').text(hands)
  }

  function updateBottomHalf () {
    var bottomHalf = 'Bib shorts'
    if (effectiveTemperature() <= 58) { bottomHalf = 'Bib knickers or bib shorts w/knee warmers or maybe just some embro' }
    if (effectiveTemperature() <= 46) { bottomHalf = 'Bib tights, bib shorts w/leg warmers, embro, etc' }
    if (effectiveTemperature() <= 35) { bottomHalf = 'Thick bib tights and perhaps a layer on top of that' }
    $('#wear-bottom').text(bottomHalf)
  }

  function updateFeet () {
    var feet = '(wool) Socks and cycling shoes'
    if (effectiveTemperature() >= 73) { feet = 'Thin (wool) socks and cycling shoes' }
    if (effectiveTemperature() <= 53) { feet = 'Wool socks and cycling shoes, toe covers if your shoes breathe well' }
    if (effectiveTemperature() <= 43) { feet = 'Wool socks and cycling shoes and toe covers' }
    if (effectiveTemperature() <= 33) { feet = 'Wool socks and cycling shoes and shoe covers' }
    $('#wear-feet').text(feet)
  }

  function updateBackground() {
    var currentPercentage = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min')) * 100
    $(this).css('background', 'linear-gradient(to right, #ddd ' + currentPercentage + '%, #fff ' + currentPercentage + '%)')
  }
})()
