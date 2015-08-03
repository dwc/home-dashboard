xively.setKey('tFgasBNBO4g3j4HeIUEPrUeQeenFE61B0dPGKoXwosIXzvYr');

$(document).ready(function() {
  var FEED_ID = '1171698610';
  var CHANNEL = 'temperature0';

  function convert(celsius) {
    return celsius * 1.8 + 32;
  }

  function displayData(data) {
    $('#celsius').text(data.current_value);
    $('#fahrenheit').text(convert(data.current_value));
    $('#timestamp').text(data.at);
  }

  xively.datastream.get(FEED_ID, CHANNEL, function(data) {
    displayData(data);
  });

  xively.datastream.subscribe(FEED_ID, CHANNEL, function(event, data) {
    displayData(data);
  });
});
