t3.Prefabs = function()
{       
    var repack = function( packed )
    {
        var args = [ null ];

        for ( var a = 0; a < packed.length; a++ )
        {
            args.push( packed[ a ] );
        }

        return args;
    };

    this.geometries = function()
    {
        var args = repack( arguments );

        return {
            box: new ( Function.prototype.bind.apply( THREE.BoxGeometry, args ) ),
            circle: new ( Function.prototype.bind.apply( THREE.CircleGeometry, args ) ),
            cylinder: new ( Function.prototype.bind.apply( THREE.CylinderGeometry, args ) ),
            sphere: new ( Function.prototype.bind.apply( THREE.SphereGeometry, args ) ),
            torus: new ( Function.prototype.bind.apply( THREE.TorusGeometry, args ) ),

        };
    };

    this.materials = function( args )
    {
        return {
            lambert: new THREE.MeshLambertMaterial( Object.assign( args, { side: THREE.FrontSide } ) ),
            phong: new THREE.MeshPhongMaterial( Object.assign( args, { side: THREE.DoubleSide, premultipliedAlpha: true } ) ),
            wireframe: new THREE.MeshBasicMaterial( Object.assign( args, { side: THREE.FrontSide, wireframe: true } ) ),

        };
    };
};
