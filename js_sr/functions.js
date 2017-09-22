            
        // Build a SR_Shader material from the js SRShader and params given
        function SRMaterial(Params) {
            
            // Diffuse, Texture_Specular, Texture_Normals, EnvMap, Specular
            var Diffuse_MapInUse = false;
            var Specular_MapInUse = false;
            var NormalMap_MapInUse = false;
            var AlphaMap_MapInUse = false;
            
            // Get the parts from  SRShader.js
            // Clone the uniforms then modifier them from the given params
            var uniforms = THREE.UniformsUtils.clone(SR_ShaderLib.srphong.uniforms);

            
            /*
            // Build noise cube map
            var urls = [
                        "/db/Projects/0038_RealDrive/web/textures/noise.png",
                        "/db/Projects/0038_RealDrive/web/textures/noise.png",
                        "/db/Projects/0038_RealDrive/web/textures/noise.png",
                        "/db/Projects/0038_RealDrive/web/textures/noise.png",
                        "/db/Projects/0038_RealDrive/web/textures/noise.png",
                        "/db/Projects/0038_RealDrive/web/textures/noise.png"
                        ];
                        
            uniforms["NoiseEnvMap"].value = new THREE.ImageUtils.loadTextureCube( urls );
            */
            
            // require that these are given ?
            uniforms["reflectivity"].value = Params.ReflectAmount;
            
            
            uniforms["envMap"].value = Params.EnvMap;
            // Custom GlossyEnvMap
            // Glossiness, map or float
            if (Params.EnvMapGlossy) {
                // console.log(Params.EnvMapGlossy)
                uniforms["EnvMapGlossy"].value = Params.EnvMapGlossy;
            }
            
            uniforms["specular"].value = Params.Specular;
            
            
            // The shader has a base glossy reflection, and a coat layer
            uniforms["ReflLayer_Glossy"].value = Params.ReflLayer_Glossy;
            uniforms["ReflLayer_Coat"].value = Params.ReflLayer_Coat;
            
            
            if (!isNaN(Params.Env_Power)) {
                uniforms["Env_Power"].value = Params.Env_Power;
            }
            if (!isNaN(Params.Env_Multiplier)) {
                uniforms["Env_Multiplier"].value = Params.Env_Multiplier;
            }

            
            // this is fucking up other objects..
            
            // console.log(Params.GlossinessColor)
            
            // Glossiness, map or float
            if (!Params.GlossinessMap == false) {
                uniforms["glossinessMap"].value = Params.GlossinessMap;
                uniforms["glossinessMap_InUse"].value = 1;
            }
            else {
                uniforms["glossinessMap_InUse"].value = 0;
            }
            
            if (!Params.Glossiness == false) {
                uniforms["glossiness"].value = Params.Glossiness;
            }
            
            
            // Reflection map
            if (!Params.ReflectionMap == false) {
                uniforms["ReflectionMap"].value = Params.ReflectionMap;
                uniforms["ReflectionMap_InUse"].value = 1;
            }
            else {
                uniforms["ReflectionMap_InUse"].value = 0;
            }
            

            
            
            
            // Glossiness Colour can be a colour or a map
            if (Params.GlossinessColor instanceof THREE.Color) {
                // console.log('GlossinessColor is a color')
                
                uniforms["glossinessColor"].value = Params.GlossinessColor;
                uniforms["GlossinessColorMap_InUse"].value = 0;
            }
            else if (Params.GlossinessColor instanceof THREE.Texture){
                // console.log('GlossinessColor is a Texture')
                uniforms["GlossinessColorMap"].value = Params.GlossinessColor;
                uniforms["GlossinessColorMap_InUse"].value = 1;
            }
            else {
                
                
            }
            
            if (!Params.Shininess == false) {
                uniforms["shininess"].value = Params.Shininess;
            }
            
            
            // Check diffuse input was a texture or a color
            if (Params.Diffuse instanceof THREE.Color) {
                uniforms["diffuse"].value = Params.Diffuse;
            }
            else {
                uniforms["diffuse"].value = new THREE.Color(1,1,1);
                uniforms["map"].value = Params.Diffuse;
                Diffuse_MapInUse = true;
            }
            
            // check if it is a number (0 = true, false = false)
            if (!isNaN(Params.Falloff)) {
                uniforms["Falloff"].value = Params.Falloff;
            }
            
            
            // If a specular texture was provided
            if (!Params.SpecularMap == false) {
                uniforms["specularMap"].value = Params.SpecularMap;
                Specular_MapInUse = true;
            }
            

            if (!Params.Opacity == false) {
                uniforms["opacity"].value = Params.Opacity;
            }
            
            
            // If a normal texture was provided
            if (!Params.NormalMap == false) {
                uniforms["normalMap"].value = Params.NormalMap;
                uniforms["normalScale"].value = new THREE.Vector2(1,1);
                NormalMap_MapInUse = true;
            }

            // if set to zero that counts as false
            if (!isNaN(Params.Ambient)) {
                    uniforms["ambient"].value =  new THREE.Color(Params.Ambient,Params.Ambient,Params.Ambient);
                
            }
            else {
                if (Params.Ambient instanceof THREE.Color) {
                    uniforms["ambient"].value = Params.Ambient;
            
                }
            }
            


            /* uniforms[ "bumpMap" ].value = Texture_Specular;
            uniforms[ "bumpScale" ].value = .1;
            */
            
            
            var material = new THREE.ShaderMaterial ({
                uniforms: uniforms,
                vertexShader: SR_ShaderLib.srphong.vertexShader,
                fragmentShader: SR_ShaderLib.srphong.fragmentShader,
                lights: true,
                fog: true
            });
            
            material.envMap = true;
            material.map = Diffuse_MapInUse;
            material.specularMap = Specular_MapInUse;
            material.normalMap = NormalMap_MapInUse;
            
            material.transparent = true;
            
            
            
            material.bumpMap = true;
            
            return material;
        }

        
        function GetTexturesFromDir(Dir, Object) {
        
            this.Diffuse = THREE.ImageUtils.loadTexture( Dir + Object + "_Diffuse.png" );
            this.Diffuse.repeat.set( 1, 1);
            this.Diffuse.wrapS = this.Diffuse.wrapT = THREE.RepeatWrapping;
            this.Diffuse.anisotropy = 16;
            
            this.Specular = THREE.ImageUtils.loadTexture( Dir + Object + "_Specular.png" );
            this.Normals = THREE.ImageUtils.loadTexture( Dir + Object + "_Normals.png" );
            
            return {Diffuse : this.Diffuse, Specular: this.Specular, Normals: this.Normals}
        }
            

        
        function AllLoaded(File){
            // console.log(File + ' loaded')
            
        }
        
        
        
        // Parent can be the scene, or a parent object
        function AddOBJ(Params) {
            var Object3D = false
            var OBJLoaded = false
            
            var manager = new THREE.LoadingManager();
            manager.onLoad = function (){
                AllLoaded(Params.File);
            }
            
            // console.log(manager);
            
            // console.log('Model: ' + Params.File + ' - Loaded: '+  manager.OBJLoaded );
            
            manager.onProgress = function ( item, loaded, total ) {
                // console.log( item, loaded, total );
                // self.OBJLoaded = loaded
                // console.log('Model: ' + Params.File + ' - Loaded: '+  self.OBJLoaded );
            }
            


            var loader = new THREE.OBJLoader(manager);
            
            // Need to catch when the obj has been loaded
            loader.load( Params.File ,  function ( object ) {
                
                // Need to traverse the objects in the obj
                object.traverse(function (child) {
                    if ( child instanceof THREE.Mesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material = Params.Material;
                    }
                } );
                
                // If scale defined then scale the object
                if (Params.Scale) {
                        object.scale.set(Params.Scale, Params.Scale, Params.Scale);
                    }
                
                if (Params.Position) {
                        object.position.x(Params.Position[0]);
                        object.position.y(Params.Position[1]);
                        object.position.z(Params.Position[2]);
                    }
                
                // oMaxRotate = object.rotation.x =  (- Math.PI / 2);
                // object.scale.set(Scale, Scale, Scale);
                // object.position.set(30,25,50);
                
                Params.Parent.add( object );
                
                /*
                console.log(object)
                console.log(object.children[0])
                console.log(object.children[0].geometry)
                */

            loader.Object = object
                
            })
            
            
            var Interval = setInterval(function(){IfLoaded()},100)
            
            function IfLoaded(){
                if (loader.Object){
                    clearInterval(Interval)
                    // console.log(loader.Object)
                    Object3D = loader.Object
                }
            }
            

            
            /*
            if (OBJLoaded == false) {
                setTimeout(function(){
                                        console.log(OBJLoaded)},3000)
                console.log(OBJLoaded)
            }
            */
            
            
        }
