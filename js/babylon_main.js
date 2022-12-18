function babylon_call() {
    const canvas = document.getElementById("renderCanvas"); // Get the canvas element
    const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    const createScene = function() {
        let myVideo;            // Our Webcam stream (a DOM <video>)
        let isAssigned = false; // Is the Webcam stream assigned to material?
        scene = new BABYLON.Scene(engine);
        let videoinput_devices_index_number = 0;
        const camera_p = new BABYLON.Vector3(0, 0, 0);
        target_p = new BABYLON.Vector3(json_data.model.position.x, json_data.model.position.y, json_data.model.position.z);
        target_r = new BABYLON.Vector3(json_data.model.rotation.x, json_data.model.rotation.y, json_data.model.rotation.z);
        const light_d = new BABYLON.Vector3(0, camera_p.y + 1, 0);
        play_enable_flag = false;
        
        if (play_enable_area_radius >= xy_info.distance) {
            play_enable_flag = true;
        }

        //カメラ
        camera =  new BABYLON.DeviceOrientationCamera("DevOr_camera", camera_p, scene);
        camera.setTarget(target_p);
        camera.attachControl(canvas, true);

        //ライト
        const light = new BABYLON.HemisphericLight("light", light_d);
        light.intensity = 0.5;

        //背景
        const blacklayer = new BABYLON.Layer('blacklayer',null, scene);
        blacklayer.isBackground = true;

        //ノード
        camera_TransformNode = new BABYLON.TransformNode("root");
        camera_TransformNode.position = camera_p;
        light.parent = camera;
        
        // GUI
        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        //表示対象オブジェクト
        object_make();
        ground_make();

        //マップ
        erea_map_make();

        //右上のメッセージテキスト
        outside_area_text(play_enable_flag);

        //デバックモード
        if(json_data.debugMode) {
            let debug_text = new BABYLON.GUI.TextBlock();
            debug_text.textHorizontalAlignment = 0;
            debug_text.textVerticalAlignment = 0; 
            debug_text.topInPixels = map_height + map_height / 10;
            debug_text.text = "デバックコマンド";
            debug_text.color = "black";
            debug_text.fontSize = 25;
            advancedTexture.addControl(debug_text);
            debug_input = new BABYLON.GUI.InputText();
            debug_input.widthInPixels = 200;
            debug_input.heightInPixels = 40;
            debug_input.horizontalAlignment = 0;
            debug_input.verticalAlignment = 0;
            debug_input.topInPixels = map_height + map_height / 10 + debug_text._fontSize._value;
            debug_input.color = "white";
            //console.log(debug_input.text.length);
            debug_input.onTextChangedObservable.add(function () {loop_geolocation();});
            //debug_input.onTextChangedObservable.add(function () {console.log(debug_input.text.length);});
            advancedTexture.addControl(debug_input);
        }

        //ボトムボタン
        bottom_button("AR");

        //ビデオ関連
        if (videoinput_devices.length > 1) {
            videoinput_devices_index_number = 1;
        }
        // Create our video texture
        BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {
            myVideo = videoTexture;
            myVideo.uScale = canvas.width / canvas.height * videoTexture.getSize().height / videoTexture.getSize().width;
        }, {deviceId: videoinput_devices[videoinput_devices_index_number].deviceId, maxWidth: canvas.width, maxHeight: canvas.height});

        scene.onBeforeRenderObservable.add(function () {
            if (myVideo !== undefined && isAssigned == false) {
                if (myVideo.video.readyState == 4) {
                    myVideo._invertY = false;
                    blacklayer.texture = myVideo;
                    isAssigned = true;
                }
            }

            if(!button_flag) {
                camera_TransformNode.rotation.y = camera.rotationQuaternion.toEulerAngles().y;
            }
        });
        return scene;
    };

    const SCENE = createScene(); //Call the createScene function

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        if(!lat_lon_time_flag) {
            lat_lon_time_flag = true;
            window.setTimeout(function(){
                loop_geolocation();
                lat_lon_time_flag = false;
            }, 10000);
        }

        //オブジェクト回転処理
        if (typeof target_objects !== 'undefined' && button_flag && json_data.model.action_type == "rotation") {
            //console.log(target_objects);
            for(let i = 0; i < target_objects.length; i++) {
                //x
                /*target_objects[i].rotation.x += 1 * (Math.PI / 180);
                if (target_objects[i].rotation.x >= 2*Math.PI) {
                    target_objects[i].rotation.x = 0;
                }*/

                //y
                target_objects[i].rotation.y += 0.5 * (Math.PI / 180);
                if (target_objects[i].rotation.y >= 2*Math.PI) {
                    target_objects[i].rotation.y = 0;
                }

                //z
                /*target_objects[i].rotation.z += 1 * (Math.PI / 180);
                if (target_objects[i].rotation.z >= 2*Math.PI) {
                    target_objects[i].rotation.z = 0;
                }*/
            }
        }
        
        SCENE.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });

    return SCENE;
}

function object_make() {
    //表示対象1
    const assetsManager = new BABYLON.AssetsManager(scene);
    const target = assetsManager.addMeshTask('obj_task', '', json_data.model.url, json_data.model.file_name);
    target.onSuccess = (task) => {
        target_objects = task.loadedMeshes;
        for(let i = 0; i < target_objects.length; i++) {
            target_objects[i].position = target_p;
            target_objects[i].rotation = target_r;
            target_objects[i].scaling = new BABYLON.Vector3(json_data.model.scale.x, json_data.model.scale.x, json_data.model.scale.x);
            target_objects[i].parent = camera_TransformNode;
            target_objects[i].visibility = play_enable_flag ? Alpha : 0;
        }
    }
    assetsManager.load();
}

function ground_make() {
    //表示対象2
    const ground = BABYLON.Mesh.CreateGround("ground", 120, 500, 100, scene);
    ground.parent = camera_TransformNode;
    ground.position.x = target_p.x;
    ground.position.y = target_p.y - 1;
    ground.position.z = target_p.z + 10;
    ground.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
    ground.visibility = 0;
    
    // Lava Material creation
    let lavaMaterial = new BABYLON.LavaMaterial("lava", scene);	
    lavaMaterial.noiseTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/lava/cloud.png", scene); // Set the bump texture
    lavaMaterial.diffuseTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/lava/lavatile.jpg", scene); // Set the diffuse texture
    lavaMaterial.speed = 1;
    lavaMaterial.fogColor = new BABYLON.Color3(1, 0, 0);
    
    ground.material = lavaMaterial;
}

function button_click() {
    if (!play_enable_flag) {
        return;
    }
    button.dispose();
    if(button_flag) {
        for(let i = 0; i < target_objects.length; i++) {
            target_objects[i].visibility = Alpha;
        }
        scene.getMeshByName("ground").visibility = 0;

        bottom_button("AR");
        const button_off_sound = new BABYLON.Sound("button_off", "./sound/button_off.mp3", scene, function callback() {button_off_sound.play();});
        button_flag = false;
    }else {
        for(let i = 0; i < target_objects.length; i++) {
            target_objects[i].visibility = 1;
        }
        
        bottom_button("off");
        const button_on_sound = new BABYLON.Sound("button_on", "./sound/button_on.mp3", scene, function callback() {button_on_sound.play();});
        if(json_data.model.action_type == "ground_place") {
            scene.getMeshByName("ground").visibility = 1;
        }
        button_flag = true;
    }
}

function bottom_button(click_type) {
    let button_url = "./img/AR_button_off.png";
    let button_name = "AR";

    if (play_enable_flag) {
        button_url = "./img/AR_button_on.png";
        if (click_type === "off") {
            button_url = "./img/cancel_button.png";
            button_name = "";
        }
    }

    button = BABYLON.GUI.Button.CreateImageWithCenterTextButton("but", button_name, button_url);
    button.width = 0.26;
    button.height = 0.2;
    button.paddingBottom = 25;
    button.verticalAlignment = 1;
    button.textBlock.outlineWidth = 3;
    button.textBlock.paddingTop = 50;
    button.textBlock.fontSize = 25;
    button.thickness = 0;
    button.onPointerClickObservable.add(function (meshes) {button_click();});
    advancedTexture.addControl(button);
}

function outside_area_text(make_flag) {
    const text = "※ARエリア内に移動してください";
    let id_right_top_text = document.getElementById("right_top_text");
    if(make_flag) {
        id_right_top_text.innerText = "";
    }else {
        id_right_top_text.innerText = text;
        if(!erea_map_make_flag) {
            id_right_top_text.style.marginLeft = "0%";
            id_right_top_text.style.inlineSize = "100%";
            id_right_top_text.style.textAlign = "center";
        }else {
            id_right_top_text.style.marginLeft = "53%";
            id_right_top_text.style.inlineSize = "47%";
            id_right_top_text.style.textAlign = "left";
        }
    }
}

function erea_map_make() {
    if((play_enable_flag || map_radius < xy_info.distance) && !json_data.map_info.isAlwaysMap) {
        return;
    }
    
    erea_map_make_flag = true; 

    map = new BABYLON.GUI.Ellipse();
    map.widthInPixels = map_width;
    map.heightInPixels = map_height;
    map.verticalAlignment = 0;
    map.horizontalAlignment = 0;
    map._alphaSet = true;
    map._alpha = 0.6;
    map.color = "Black";
    map.thickness = 15;
    advancedTexture.addControl(map);
    
    play_area = new BABYLON.GUI.Ellipse();
    play_area.widthInPixels = map_width / 3;
    play_area.heightInPixels = map_height / 3;
    play_area.color = "Black";
    play_area.thickness = 0;
    play_area.background = "limegreen";
    play_area._alphaSet = true;
    play_area._alpha = 0.6;
    play_area.verticalAlignment = 0;
    play_area.horizontalAlignment = 0;
    
    play_area.topInPixels = (map_height / 2) - ((map_height / 3) / 2);
    play_area.leftInPixels = (map_width / 2) - ((map_width / 3) / 2);
    advancedTexture.addControl(play_area);

    my_position = new BABYLON.GUI.Ellipse();
    my_position.widthInPixels = 15;
    my_position.heightInPixels = 15;
    my_position.thickness = 0;
    my_position.background = "cornflowerblue";
    my_position.verticalAlignment = 0;
    my_position.horizontalAlignment = 0;
    let my_position_distance = map_radius;
    const theta = xy_info.bearing;
    if (my_position_distance > xy_info.distance) {
        my_position_distance = xy_info.distance;
    }
    let my_position_distance_rescale = (my_position_distance - 0) / (150 - 0) * (map_width / 2 - 0) + 0; 
    my_position.leftInPixels = (map_width / 2) + (my_position_distance_rescale * Math.cos(theta * Math.PI / 180));
    my_position.topInPixels = (map_height / 2) + (my_position_distance_rescale * Math.sin(theta * Math.PI / 180));
    my_position.leftInPixels -= my_position.widthInPixels / 2;
    my_position.topInPixels -= my_position.heightInPixels / 2;
    advancedTexture.addControl(my_position);
}

function lat_lon_page_renewal() {
    //プレイエリア内か再チェック
    const former_play_enable_flag = play_enable_flag;
    let change_flag = false;
    play_enable_flag = false;
    if (play_enable_area_radius >= xy_info.distance) {
        play_enable_flag = true;
    }

    //エリア外かエリア内かの変化をチェック
    if (former_play_enable_flag != play_enable_flag) {
        change_flag = true;
    }

    //描画処理
    if (play_enable_flag && !change_flag) {
        return;
    }else if (play_enable_flag) {
        //ARプレイ可の場合
        //ARエリアの外から中に移った場合
        
        //オブジェクト更新
        for(let i = 0; i < target_objects.length; i++) {
            target_objects[i].visibility = Alpha;
        }
        scene.getMeshByName("ground").visibility = 0;
        
        //マップ更新
        if(json_data.map_info.isAlwaysMap) {
            //my_position更新
            let my_position_distance = map_radius;
            const theta = xy_info.bearing;
            if (my_position_distance > xy_info.distance) {
                my_position_distance = xy_info.distance;
            }
            let my_position_distance_rescale = (my_position_distance - 0) / (150 - 0) * (map_width / 2 - 0) + 0; 
            my_position.leftInPixels = (map_width / 2) + (my_position_distance_rescale * Math.cos(theta * Math.PI / 180));
            my_position.topInPixels = (map_height / 2) + (my_position_distance_rescale * -Math.sin(theta * Math.PI / 180));
        }else {
            if(erea_map_make_flag) {
                map.dispose();
                play_area.dispose();
                my_position.dispose();
                erea_map_make_flag = false;
            }
        }
        //テキスト更新
        outside_area_text(play_enable_flag);
        
        //ボタン更新
        button.dispose();
        bottom_button("AR");
    }else {
        //ARプレイ不可の場合
        if(change_flag) {
            //中から外に移った時の処理

            //オブジェクトの更新
            for(let i = 0; i < target_objects.length; i++) {
                target_objects[i].visibility = 0;
            }
            scene.getMeshByName("ground").visibility = 0;
            
            //マップ更新
            if (erea_map_make_flag) {
                map.dispose();
                play_area.dispose();
                my_position.dispose();
                erea_map_make_flag = false;
            }
            erea_map_make();
            
            //テキスト更新
            outside_area_text(play_enable_flag);

            //ボタン更新
            button.dispose();
            bottom_button("AR");
        }else {
            //プレイエリアの外を移動した場合
            
            //マップ、テキスト更新
            //マップ範囲内に入った時にマップを表示
            if(!erea_map_make_flag && map_radius >= xy_info.distance) {
                erea_map_make();
                outside_area_text(play_enable_flag);
            }
            //マップ内の現在地ポジションを移動
            if (erea_map_make_flag) {
                let my_position_distance = map_radius;
                const theta = xy_info.bearing;
                if (my_position_distance > xy_info.distance) {
                    my_position_distance = xy_info.distance;
                }
                let my_position_distance_rescale = (my_position_distance - 0) / (150 - 0) * (map_width / 2 - 0) + 0; 
                my_position.leftInPixels = (map_width / 2) + (my_position_distance_rescale * Math.cos(theta * Math.PI / 180));
                my_position.topInPixels = (map_height / 2) + (my_position_distance_rescale * -Math.sin(theta * Math.PI / 180));
            }
        }
    }
}