function getCoordsOfNextPoint( firstPoint, nextPoint, prevXY = {x: 0, y: 0} ) {

  const bearing = turf.bearing(firstPoint, nextPoint);
  const distance = turf.distance(firstPoint, nextPoint, {units: 'meters'});

  const xy_info = {
    x:  prevXY.x + distance * 1000 * Math.cos(bearing * Math.PI / 180),
    y:  prevXY.y + distance * 1000 * Math.sin(bearing * Math.PI / 180),
    bearing: bearing,
    distance: distance
  };

  return xy_info;
}

function geolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const center_axis = [json_data.map_info.play_enable_area.latitude, json_data.map_info.play_enable_area.longitude];
      xy_info = getCoordsOfNextPoint(center_axis, [position.coords.latitude, position.coords.longitude]);
      babylon_call();
    }); 
  } else {
    alert("I'm sorry, but geolocation services are not supported by your browser.");
  }
}

function loop_geolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const center_axis = [json_data.map_info.play_enable_area.latitude, json_data.map_info.play_enable_area.longitude];
      xy_info = getCoordsOfNextPoint(center_axis, [position.coords.latitude, position.coords.longitude]);

      if(json_data.debugMode) {
        if(debug_input.text == "0" || debug_input.text == "1" || debug_input.text == "2") {
          const debug_mode_array = [[json_data.map_info.play_enable_area.latitude, json_data.map_info.play_enable_area.longitude], [35.627468, 139.742500], [35.6965, 139.7055]]; //デバックモードのデバックコマンドに対応 入力された情報から配列のインデックスで0,1,2を判別
          xy_info = getCoordsOfNextPoint(center_axis, debug_mode_array[debug_input.text]);
        }
      }
      lat_lon_page_renewal();
    }); 
  } else {
    alert("I'm sorry, but geolocation services are not supported by your browser.");
  }
}
