t3.Objects = function()
{
    var create = function()
    {
        var args = arguments[ 0 ];
        var vertices = new t3.Vertices();
        var prefab = new t3.Prefabs();
        var geometry = prefab.geometries.apply( null, args.geometry.parameters )[ args.geometry.name ];
        var material = prefab.materials.call( null, args.material.parameters )[ args.material.name ];

        t3.events.trigger( window, 'object.created',
        {
            obj: 'Objects',
            fn: 'add',
            args:
            {
                shape:
                {
                    name: args.name,
                    object: new THREE.Mesh( geometry, material ),
                    vertices: vertices[ args.shape.name ]( { parameters: args.shape.parameters } )
                },
                // stack: Objects.add >> utils.placement >> loop.animate >> utils.process
                animations: args.animations
            }
        } );
    };

    this.init = function()
    {
        var creations = [];

        var creation = {};
            creation.name = "globe";
            // particle
            creation.geometry =
            {
                name: "box",
                parameters: [ 1, 1, 0.1 ] //cylinder: radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength// box: [ 1, 1, 1 ] //sphere: [ 1, 8, 8 ] // torus: [ 1, 0.5, 8, 6 ] radius, tube, segments, sides
            };
            creation.material =
            {
                name: "phong",
                parameters: { color: 0xFFFFFF, map: t3.handles.props.environment, refractionRatio: 0.6 }
            };
            // shape of the group
            creation.shape =
            {
                //name: "spiral",
                //parameters: { axis: 'y', scale: { x: 4, y: 4, z: 4 }, stacks: 8, slices: 16, spacing: 0.3, radius: { start: 0, i: 1, f: 'linear' } }
                // cube
                //parameters: { axis: 'y', scale: { x: 2, y: 2, z: 1 }, x: 8, y: 8, z: 8, spacing: 0.1 }
                // helix, cylinder
                //parameters: { axis: 'y', scale: { x: 4, y: 4, z: 4 }, stacks: 8, slices: 16, spacing: 0.3 }
                //parabola
                //parameters: { axis: 'z', scale: { x: 1, y: 1, z: 1 }, count: 10 }
                // sphere
                name: "sphere",
                parameters: { axis: 'y', scale: { x: 4, y: 4, z: 4 }, stacks: 8, slices: 16 }
            };
            creation.animations =
            [
                [
                    { name: 'fade', active: false, units: 1, duration: 1, timer: new t3.Timer() }
                ],
                [
                    { name: 'rotate', active: false, axis: 'y', units: -1, duration: Infinity, speed: 0.03, timer: new t3.Timer() },
                    { name: 'rotate', active: false, axis: 'z', units: -1, duration: 10, speed: 0.1, timer: new t3.Timer() }
                ]
            ];

        creations.push( creation );

        for ( var c = 0; c < creations.length; c++ )
        {
            create( creations[ c ] );
        }
    };

    this.add = function()
    {
        var args = arguments[ 0 ];

        t3.utils.placement( args );
    }
};