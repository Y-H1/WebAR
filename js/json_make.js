const obj = {
    model: {
        file_name: "GKJR6MAIEHQTDJSWLSFW69ZE8.obj",
        url: "./mountain_obj/",
        position: {
            x: 0,
            y: 0,
            z: 10
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: {
            x: 1.5,
            y: 1.5,
            z: 1.5
        },
        action_type: "rotation"
    },
    map_info: {
        map: {
            radius: 150,
            width: 200,
            height: 200
        },
        play_enable_area: {
            latitude: 35.6274257,
            longitude: 139.7418397,
            radius: 50
        },
        isAlwaysMap: false
    },
    debugMode: true
}

/*const obj = {
    model: {
        file_name: "anim-logo.glb",
        url: "./model/",
        position: {
            x: 0,
            y: 0,
            z: 10
        },
        rotation: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: {
            x: 1.5,
            y: 1.5,
            z: 1.5
        }
    },
    map_info: {
        map: {
            radius: 150,
            width: 200,
            height: 200
        },
        play_enable_area: {
            latitude: 35.6274257,
            longitude: 139.7418397,
            radius: 50
        },
        isAlwaysMap: true
    }
}*/
// オブジェクトデータをJSON化
let json = JSON.stringify(obj);

// JSONを再びオブジェクトデータの形式に変換
//json = JSON.parse(json);
//console.log(json);
//console.log(typeof json);

//let a = document.createElement('a');

// 保存するJSONファイルの名前
const fileName = "test.json";
 
// データをJSON形式の文字列に変換する。
//const data = JSON.stringify(originalData);
 
// HTMLのリンク要素を生成する。
const link = document.createElement("a");
 
// リンク先にJSON形式の文字列データを置いておく。
link.href = "data:text/plain," + encodeURIComponent(json);
 
// 保存するJSONファイルの名前をリンクに設定する。
link.download = fileName;
 
// ファイルを保存する。
//link.click();