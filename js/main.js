//グローバル変数
const json_path = "../json/main.json";
let json_data;
//geolocation.js
let xy_info;
//babylon_main.js
let scene;
let target_objects;
let animationGroup;
let camera_TransformNode;
let advancedTexture;
let textG;
let button;
let camera;
let button_flag = false;
const Alpha = 0.7;
let target_p;
let target_r;
let play_enable_flag;
let lat_lon_time_flag = false;
let map_radius = 150;
let play_enable_area_radius = 50;
let map_width = 200;
let map_height = 200;
let map;
let play_area;
let my_position;
let debug_input;
let erea_map_make_flag = false;
let object_rotation_flag = false;

let videoinput_devices;

//カメラデバイスの情報を取得
const devices = navigator.mediaDevices.enumerateDevices();
devices.then(function(data) { 
    videoinput_devices = data.filter(function(value) {
        return value.kind == "videoinput";
    });

    json_load();
});

function json_load() {
    import(json_path, {assert: {type: "json"}}).then(function(data) {
        json_data = data.default;
        map_radius = json_data.map_info.map.radius;
        map_height = json_data.map_info.map.height;
        map_width = json_data.map_info.map.width;
        play_enable_area_radius = json_data.map_info.play_enable_area.radius;
        geolocation();
    });
}