# WebAR
WebAR
このプログラムはBabylon.jsを用いて、カメラから取得した映像を背景とした3次元空間に3Dモデルを表示させ、スマートフォンのジャイロセンサーと組み合わせることによって3Dモデルを自由に3D空間内設置できるようにしたWebARアプリケーションである。主要な機能としてはモデル表示機能とマップ機能がある。
モデル表示機能では画面内にあるボタン動作によってそのもでるが3D空間内の位置に固定され、回転や地面(ground)の設置といった動作を行う。
マップ機能では、現在地と目的地(ARプレイ可能エリア)の位置情報を目的地を中心としたマップで可視化する。さらにこれらの位置情報から上記のモデル表示機能を制限し、利用者が目的地(ARプレイ可能エリア)いる場合のみARモデル表示機能を使うことができるようにする。

# Features
***ディレクトリ構造***


./main  
 
        /css        

        /img
        
        /js
        
        /json
        
        /model/mountain_obj
        
        /sound


**./main**

* index.html <最初に実行するメインファイル>
* css
* img
* js
* json
* model
* sound


**/css**

* style.css <"index.html"のスタイルシート>


**/img**

* AR_button_off.png <ARボタンがオフになった状態のボタンイメージ> ※自作

* AR_button_on.png <ARボタンがオンになった状態のボタンイメージ> ※自作

* cancel_button.png <AR状態をキャンセルするボタンイメージ> ※自作


**/js**            

* babylon_main.js <babylon.jsでの3D空間作成、コントロール、モデルのコントロール>

* geolocation.js <位置情報関係の処理や関数、現在地などを取得する>

**/json**
* main.json <モデルデータやARプレイ可能エリアの緯度経度情報など当システムの動作に必要なデータを格納> ※基礎となるデータを変更したい場合はこのファイルを編集

**/model**

* anim-logo.glb <実際の3Dモデルファイル(フォーラムエイトロゴ)>

**/model/mountain_obj** ※ネットからダウンロードしたモデルフォルダー
* default-grey.jpg
* GKJR6MAIEHQTDJSWLSFW69ZE8.jpg
* GKJR6MAIEHQTDJSWLSFW69ZE8.mtl
* GKJR6MAIEHQTDJSWLSFW69ZE8.obj <実際の3Dモデルファイル(山)> ※https://rigmodels.com/model.php?view=Terrain-3d-model__GKJR6MAIEHQTDJSWLSFW69ZE8&searchkeyword=mountain&manualsearch=1
* License.txt
* majestic_mountain_mtl1_diffcol.jpg
* Visit RigModels.com

**/sound**

* button_off.mp3 <画面に表示されているARキャンセルボタンを押した音> ※https://soundeffect-lab.info/sound/button/ 決定ボタンを押す48

* button_on.mp3 <画面に表示されているARボタンを押した音> ※https://soundeffect-lab.info/sound/button/ 決定ボタンを押す34


# Requirement
* Node.js 16.17.1

# Note
基礎となるデータ(モデルやプレイ可能エリアの情報)を変更したい場合はmain.jsonを編集する。

<br>

main.jsonにあるmap_info.map.radius:プロパティは実際のマップ範囲や位置情報、位置関係の計算に使うためのプロパティのため画面に表示するマップ表示面のプロパティではない。マップ表示面のプロパティは、heightとwidthを使う。

<br>

main.jsonにあるisAlwaysMapプロパティ(boolean)は利用者の現在地情報に関わらず常にマップを表示すること表す。

<br>

main.jsonにあるdebugModeプロパティ(boolean)はデバックモード使用の有無を表し、trueだと表示画面に入力可能なテキストボックスが現れ、0,1,2を入力すると現在地を強制的に変更できる。
※設定する値の説明

0 プレイ可能エリア内の緯度経度(35.6274399, 139.7418536)

1 プレイ可能エリア外のマップ描画範囲内の緯度経度(35.6284399, 139.7418536) ※ARプレイ可能エリアの中心を品川インターシティ、マップのradiusを150mと定義した場合

2 プレイ可能エリア外のマップ描画範囲外の緯度経度(35.6965, 139.7055) ※ARプレイ可能エリアの中心を品川インターシティ、マップのradiusを150mと定義した場合

<br>

main.jsonにあるaction_typeプロパティ(String)は"ground_place"と"rotation"の文字列を受け取ることでAR利用可能エリアでのモデル動作の種類を設定できる。"ground_place"はgroundの設置、"rotation"はモデルの回転動作を表す。

<br>

マップ機能は上側を北とした東西南北に対応している。

# Author
* 作成者 星野 悠人