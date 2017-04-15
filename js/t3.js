var t3 = ( function()
{
    var shapes = [];
    var track = [];
    var settings =
    {
        camera:
        {
            position: new THREE.Vector3( 0, 0, 20 )
        },

        controls:
        {
            autoForward: true,
            disabled: true
        },

        debug:
        {
            events: false,
            js: false,
            lights: false,
            scene: false
        },

        environment:
        {
            texture: "/images/tito.jpg",//null,
            fog: new THREE.FogExp2( 0x425365, 0.005 )//false
        }
    };

    return {
        init: ( function()
        {
            var action = function()
            {
                t3.utils.attach( { object: t3.handles.props.bulb, animation: { name: 'hsl', active: true, axis: 'h', start: { h: 0.5, s: 0.3, l: 0.5 }, units: 1, duration: Infinity, speed: 0.1, timer: new t3.Timer() } } );
                t3.utils.attach(
                {
                    object: t3.handles.props.bulb,
                    animation:
                    {
                        name: 'orbit',
                        active: true,
                        axis: 'y',
                        //start: new THREE.Vector3( 0, 0, 0 ),
                        units: 5,
                        duration: Infinity,
                        speed: 0.1,
                        //data: [ [ 0, 0 ], [ 10, 10 ], [ 10, 20 ], [ -20, -10 ] ],
                        timer: new t3.Timer()
                    }
                } );

                t3.events.trigger( window, "init.action", { obj: 'Objects', fn: 'init', args: {} } );
            };

            var controls = function()
            {
                var controls = new t3.Controls( { object: t3.handles.props.camera, parent: document.body, autoForward: settings.controls.autoForward, disabled: settings.controls.disabled } );
                    controls.movementSpeed = 1;
                    controls.rollSpeed = Math.PI / 24;

                // add handle
                t3.handles.props.controls = controls;
            };

            var environment = function()
            {
                t3.handles.props.environment = settings.environment.texture ? THREE.ImageUtils.loadTexture( settings.environment.texture ) : false;
            };

            var lights = function()
            {
                var mesh;

                var lights =
                {
                    ambient:        { parent: 'scene', object: new THREE.AmbientLight( 0xFFFFFF, 0.01 ) },
                    bulb:           { parent: 'scene', object: new THREE.PointLight( 0xFF66FF, 0.7, 10, 2 ) },
                    headlight:      { parent: 'camera', object: new THREE.SpotLight( 0xCCFFFF, 1, 50, 0.8, 0.6, 2 ) },
                    directional:    { parent: 'scene', object: new THREE.DirectionalLight( 0xCCCCFF, 0.2 ) }
                };

                for ( var light in lights )
                {
                    if ( lights.hasOwnProperty( light ) )
                    {
                        lights[ light ].object.name = light;
                        lights[ light ].object.visible = true;
                        lights[ light ].object.animations = [];
                        lights[ light ].object.animations.push( [] );
                        // add to scene
                        t3.handles.props[ lights[ light ].parent ].add( lights[ light ].object );
                        // add handle
                        t3.handles.props[ light ] = lights[ light ].object;

                        if ( settings.debug.lights )
                        {
                            mesh = new THREE.Mesh( new THREE.SphereGeometry( 1, 4, 4 ), new THREE.MeshPhongMaterial( { wireframe: true, emissive: lights[ light ].object.color } ) )
                            lights[ light ].object.add( mesh );
                        }
                    }
                }

                // headlight
                t3.handles.props.camera.add( t3.handles.props.headlight );
                t3.handles.props.headlight.position.set( 0, 0, 1 );
                t3.handles.props.headlight.target = t3.handles.props.camera;
            };

            var three = function()
            {
                t3.handles.props.origin = new THREE.Vector3();

                t3.handles.props.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
                t3.handles.props.camera.name = "camera";
                t3.handles.props.camera.position.set( settings.camera.position.x, settings.camera.position.y, settings.camera.position.z );
                t3.handles.props.camera.animations = [];
                t3.handles.props.camera.animations.push( [] );
                t3.handles.props.camera.lookAt( t3.handles.props.origin );

                t3.handles.props.scene = new THREE.Scene();

                t3.handles.props.renderer = new THREE.WebGLRenderer();

                t3.handles.props.axes = new THREE.AxisHelper( 100 );
            };

            return {
                scene: function()
                {
                    // set required objects and lights
                    three();
                    controls();
                    environment();
                    lights();

                    // camera
                    t3.handles.props.scene.add( t3.handles.props.camera );

                    // axes
                    if ( settings.debug.scene ) t3.handles.props.scene.add( t3.handles.props.axes );

                    // scene
                    t3.handles.props.scene.fog = settings.fog;
                    t3.handles.props.scene.matrixAutoUpdate = true;

                    // renderer
                    t3.handles.props.renderer.antialias = true;
                    t3.handles.props.renderer.setClearColor( 0x000000 );
                    t3.handles.props.renderer.setPixelRatio( window.devicePixelRatio );
                    t3.handles.props.renderer.setSize( window.innerWidth, window.innerHeight );
                    t3.handles.props.renderer.logarithmicDepthBuffer = false;

                    document.body.appendChild( t3.handles.props.renderer.domElement );

                    action();
                }
            };
        } )(),

        events: ( function()
        {
            return {
                create : function( target, name, detail )
                {
                    target.addEventListener( name, t3.events.listen );

                    return new CustomEvent( name, { detail: detail } );
                },

                dispatch: function( target, event )
                {
                    if ( settings.debug.events ) console.log( event );
                    target.dispatchEvent( event );
                },

                listen: function( event )
                {
                    var scope = new t3[ event.detail.obj ];
                        scope[ event.detail.fn ].call( null, event.detail.args );
                },

                trigger: function( target, name, detail )
                {
                    var event = t3.events.create( target, name, detail );

                    t3.events.dispatch( target, event );
                }
            }
        } )(),
        
        handles:
        {
            animations: [],
            objects: [],
            props: {}
        },

        loop: ( function()
        {
            var last = 0;

            return {
                animate: function( tick )
                {
                    var frame = requestAnimationFrame( t3.loop.animate );
                    var delta = ( tick - last ) / 1000;
                    last = tick;

                    t3.handles.props.controls.update( delta );
                    t3.utils.process( frame );
                    t3.loop.render();
                },

                render: function()
                {
                    t3.handles.props.renderer.render( t3.handles.props.scene, t3.handles.props.camera );
                },
            };
        } )(),

        utils: ( function()
        {
            return {
                axes: [ "x", "y", "z" ],

                attach: function()
                {
                    var args = arguments[ 0 ];
                        args.object.animations[ 0 ].push( args.animation );

                    if ( t3.handles.objects.indexOf( args.object ) === -1 )
                        t3.handles.objects.push( args.object );
                },

                bounds: function( object )
                {
                    var bounds = new THREE.BoundingBoxHelper( object, 0x003333 );
                        bounds.update();

                    if ( settings.debug.scene ) t3.handles.props.scene.add( bounds );

                    return bounds;
                },

                center: function( object )
                {
                    var bounds = t3.bounds( object );
                    var min, max, size;

                    for ( a = 0; a < axes.length; a++ )
                    {
                        min = bounds.box.min[ t3.utils.axes[ a ] ];
                        max = bounds.box.max[ t3.utils.axes[ a ] ];
                        size = max - min;

                        object.position[ t3.utils.axes[ a ] ] = -size / 2;
                    }

                    bounds.update();
                },

                copy: function( object )
                {
                    var copy = {};
                    var key ;

                    for ( key in object )
                    {
                        if ( object.hasOwnProperty( key ) ) copy[ key ] = object[ key ];
                    }

                    return copy;
                },

                placement: function()
                {
                    var args = arguments[ 0 ];
                    var group = new THREE.Group();
                        group.name = args.shape.name;
                        group.animations = args.animations;
                    var object = {};
                    var positions = new THREE.BufferAttribute( args.shape.vertices.position, 3 );
                    var rotations = new THREE.BufferAttribute( args.shape.vertices.rotation, 3 );
                    var p = positions.count;

                    // place the objects
                    while ( p > 0 )
                    {
                        p--;
                        object = args.shape.object.clone();
                        object.name = args.shape.name + [ p ];

                        for ( var a = 0; a < t3.utils.axes.length; a++ )
                        {
                            object.position[ t3.utils.axes[ a ] ] = positions.array[ p * t3.utils.axes.length + a ];
                            object.rotation[ t3.utils.axes[ a ] ] = rotations.array[ p * t3.utils.axes.length + a ];
                        }

                        group.add( object );
                    }

                    // add to props
                    t3.handles.props.scene.add( group );
                    // add to shapes array
                    shapes.push( group );

                    if ( settings.debug.scene ) t3.utils.bounds( group );

                    t3.loop.animate();
                },

                process: function( frame )
                {
                    // objects are added through utils.placement();
                    // t3.handles.objects are added through animations.attach();

                    var ol = shapes.length;
                    var pl, al, il;
                    var object;
                    var animations = [];
                    var animation = {};
                    var tracker = {};
                    var a = new t3.Animations();
                    //var settings.debug.js = frame > 0 && frame < 20;

                    // check for and add objects to process array
                    while ( ol > 0 )
                    {
                        ol--;
                        object = t3.utils.copy( shapes[ ol ] );
                        object.animations = [ shapes[ ol ].animations[ t3.utils.store.animations.index ] ];
                        tracker = t3.utils.store.animations.index + "-" + object.uuid;

                        if ( track.indexOf( tracker ) === -1 )
                        {
                            track.push( tracker );
                            t3.handles.objects.push( object );
                        }
                    }

                    pl = t3.handles.objects.length;

                    // process the entire array of objects added by all methods
                    while ( pl > 0 )
                    {
                        pl--;

                        if ( t3.handles.objects[ pl ].animations )
                        {
                            animations = t3.handles.objects[ pl ].animations;
                            al = animations.length;

                            while ( al > 0 )
                            {
                                al--;

                                if ( animations[ al ] )
                                {
                                    il = animations[ al ].length;

                                    while ( il > 0 )
                                    {
                                        il--;
                                        animation = animations[ al ][ il ];

                                        // make public to allow manipulation
                                        if ( t3.handles.animations.indexOf( animation ) === -1 )
                                            t3.handles.animations.push( animation );

                                        /*if ( settings.debug.js )
                                        {
                                            console.info( pl, t3.handles.objects[ pl ].name, il )
                                            console.log( animation );
                                            console.log( t3.handles.objects[ pl ] );
                                        }*/

                                        if ( animation.active )
                                        {
                                            if ( !animation.timer.running )
                                            {
                                                animation.timer.running = true;
                                                animation.timer.frame = frame;
                                                animation.timer.reset();
                                            }

                                            a[ animation.name ].call( null, { object: t3.handles.objects[ pl ], animation: animation, index: il } );
                                        }
                                        else
                                        {
                                            a.next( t3.handles.objects[ pl ], animations[ al ] );
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                search: function()
                {
                    var args = arguments[ 0 ];
                    var result = {};
                    var name;
                    var value;
                    var f = 0;

                    if ( !args.hasOwnProperty( 'type' ) ) return result;

                    var recurse = function( object, filter )
                    {
                        name = Object.keys( filter )[ 0 ];
                        value = filter[ name ];

                        if ( typeof object === 'object' )
                        {
                            for ( var key in object )
                            {
                                if ( typeof object === "object" )
                                {
                                    if ( object.hasOwnProperty( name ) )
                                    {
                                        if ( object[ name ] === value )
                                        {
                                            if ( f < args.filter.length )
                                            {
                                                f++;
                                                result = object;
                                                if ( args.filter[ f ] ) recurse( object, args.filter[ f ] );

                                                return result;
                                            }
                                        }

                                        break;
                                    }
                                    else
                                    {
                                        if ( object.hasOwnProperty( key ) ) recurse( object[ key ], filter );
                                    }
                                }
                            }
                        }

                        return result;
                    }

                    return recurse( t3.handles[ args.type ], args.filter[ f ] );
                },

                store:
                {
                    animations: { index: 0 }
                }
            };
        } )()
    };
} )();