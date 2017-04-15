t3.Vertices = function()
{
    var axes = [ "x", "y", "z" ];

    var axisLeft = function( axis )
    {
        var clone = cloneArray( axes );

        return clone.splice( clone.indexOf( axis ) - 1, 1 ).toString();
    };

    var axisRight = function( axis )
    {
        var clone = cloneArray( axes );

        return clone.splice( clone.indexOf( axis ) + 1, 1 ).toString();
    };

    var cloneArray = function( array )
    {
        return array.slice( 0 );
    };

    var degrees = function( angle )
    {
        return parseInt( ( 360 * angle / ( 2 * Math.PI ) ).toFixed( 0 ) );
    };
    
    var half = function( number )
    {
        var value = {};
            value.low = -( number - 1 ) / 2;
            value.high = ( number - 1 ) / 2;

        return value;
    };

    var hash = function( array, value )
    {
        var hash = {};

        for( var i = 0 ; i < array.length; i++ )
        {
            hash[ array[ i ] ] = i;
        }

        return hash.hasOwnProperty( value );
    };

    var precision = function( value, n )
    {
        return Math.round( value * Math.pow( 10, n ) ) / Math.pow( 10, n );
    };

    var offset = function()
    {
        var args = arguments[ 0 ];
        var offsets = args ? args.offsets : {};
            offsets.position = offsets.position ? args.offsets.position : new THREE.Vector3();
            offsets.rotation = offsets.rotation ? args.offsets.rotation : new THREE.Vector3();

        return offsets;
    };

    var rotational = function()
    {
        var args = arguments[ 0 ];
        var offsets = offset( args.data.parameters.offsets );
        var angle = args.data.angle + offsets.rotation[ args.data.parameters.axis ];
        var sin = 0
        var cos = 0
        var v = args.data.v + offsets.position[ args.data.parameters.axis ];

        switch ( args.data.parameters.axis )
        {
            case "x":
                sin = Math.sin( args.data.angle ) * args.data.parameters.scale.y + offsets.position.y;
                cos = Math.cos( args.data.angle ) * args.data.parameters.scale.z + offsets.position.z;
                args.arrays.position.push( v, sin, cos );
                args.arrays.rotation.push( angle, offsets.rotation.y, offsets.rotation.z );
            break;

            case "y":
                sin = Math.sin( args.data.angle ) * args.data.parameters.scale.x + offsets.position.x;
                cos = Math.cos( args.data.angle ) * args.data.parameters.scale.z + offsets.position.z;
                args.arrays.position.push( sin, v, cos );
                args.arrays.rotation.push( offsets.rotation.x, angle, offsets.rotation.z );
            break;

            case "z":
                sin = Math.sin( args.data.angle ) * args.data.parameters.scale.y + offsets.position.x;
                cos = Math.cos( args.data.angle ) * args.data.parameters.scale.z + offsets.position.y;
                args.arrays.position.push( sin, cos, v );
                args.arrays.rotation.push( offsets.rotation.x, offsets.rotation.y, angle );
            break;
        }

        return args.arrays;
    };

    var spiral = function()
    {
        var args = arguments[ 0 ];
        var offsets = offset( args.data.parameters.offsets );
        var angle = args.data.angle + offsets.rotation[ args.data.parameters.axis ];
        var sin = 0
        var cos = 0
        var v = args.data.v + offsets.position[ args.data.parameters.axis ];

        switch ( args.data.parameters.axis )
        {
            case "x":
                sin = Math.sin( args.data.angle ) * args.data.parameters.scale.y + offsets.position.y;
                cos = Math.cos( args.data.angle ) * args.data.parameters.scale.z + offsets.position.z;
                args.arrays.position.push( v, sin, cos );
                args.arrays.rotation.push( angle, offsets.rotation.y, offsets.rotation.z );
            break;

            case "y":
                sin = Math.sin( args.data.angle ) * args.data.parameters.scale.x + offsets.position.x;
                cos = Math.cos( args.data.angle ) * args.data.parameters.scale.z + offsets.position.z;
                args.arrays.position.push( sin, v, cos );
                args.arrays.rotation.push( offsets.rotation.x, angle, offsets.rotation.z );
            break;

            case "z":
                sin = Math.sin( args.data.angle ) * args.data.parameters.scale.y + offsets.position.x;
                cos = Math.cos( args.data.angle ) * args.data.parameters.scale.z + offsets.position.y;
                args.arrays.position.push( sin, cos, v );
                args.arrays.rotation.push( offsets.rotation.x, offsets.rotation.y, angle );
            break;
        }

        return args.arrays;
    };

    // API
    this.cube = function()
    {
        var args = arguments[ 0 ];
        var offsets = offset( args.parameters.offsets );
        var arrays =
        {
            position: [],
            rotation: []
        };
        var s = ( 1 + args.parameters.spacing );
        var hx = half( args.parameters.x * s );
        var hy = half( args.parameters.y * s );
        var hz = half( args.parameters.z * s );
        var vx, vy, vz;

        for ( var x = hx.low; x <= hx.high; x++ )
        {
            vx = x * s * args.parameters.scale.x + offsets.position.x;

            for ( var y = hy.low; y <= hy.high; y++ )
            {
                vy = y * s * args.parameters.scale.y + offsets.position.y;

                for ( var z = hz.low; z <= hz.high; z++ )
                {
                    vz = z * s * args.parameters.scale.z + offsets.position.z;

                    arrays.position.push( vx, vy, vz );
                    arrays.rotation.push( offsets.rotation.x, offsets.rotation.y, offsets.rotation.z );
                }
            }
        }

        return { position: new Float32Array( arrays.position ), rotation: new Float32Array( arrays.rotation ) };
    };

    this.cylinder = function()
    {
        var args = arguments[ 0 ];
        var arrays =
        {
            position: [],
            rotation: []
        };
        var angle;
        var circle = Math.PI * 2;
        var s = args.parameters.spacing * args.parameters.scale[ args.parameters.axis ];

        for ( var v = half( args.parameters.stacks ).low; v <= half( args.parameters.stacks ).high; v++ )
        {
            for ( var h = 0; h < args.parameters.slices; h++ )
            {
                angle = circle * h / args.parameters.slices % circle;

                rotational( { arrays: arrays, data: { angle: angle, v: v * s, parameters: args.parameters } } );
            }
        }

        return { position: new Float32Array( arrays.position ), rotation: new Float32Array( arrays.rotation ) };
    };

    this.helix = function()
    {
        var args = arguments[ 0 ];
        var arrays =
        {
            position: [],
            rotation: []
        };
        var angle = 0;
        var circle = Math.PI * 2;
        var s = args.parameters.spacing * args.parameters.scale[ args.parameters.axis ];
        var h = args.parameters.stacks * args.parameters.slices;
        var v = -args.parameters.stacks * s;
        var increment = s / args.parameters.stacks;

        while ( h > 0 )
        {
            h--;
            v += increment;
            angle = circle * h / args.parameters.slices % circle;

            rotational( { arrays: arrays, data: { angle: angle, v: v, parameters: args.parameters } } );
        }

        return { position: new Float32Array( arrays.position ), rotation: new Float32Array( arrays.rotation ) };
    };

    this.parabola = function()
    {
        var args = arguments[ 0 ];
        var offsets = offset( args.parameters.offsets );
        var arrays =
        {
            position: [],
            rotation: []
        };
        var angle = 0;
        var hc = half( args.parameters.count );

        for ( var c = hc.low; c <= hc.high; c++ )
        {
            angle = Math.atan( Math.pow( c, 2 ) / c ) + offsets.rotation[ args.parameters.axis ];

            switch ( args.parameters.axis )
            {
                case "x":
                    arrays.position.push( Math.pow( c, 2 ) + offsets.position.x, offsets.position.y, c * 2 + offsets.position.z );
                    arrays.rotation.push( offsets.rotation.x, angle, offsets.rotation.z );
                break;

                case "y":
                    arrays.position.push( c * 2 + offsets.position.x, Math.pow( c, 2 ) + offsets.position.y, offsets.position.z );
                    arrays.rotation.push( offsets.rotation.x, offsets.rotation.y, angle );
                break;

                case "z":
                    arrays.position.push( offsets.position.x, c * 2 + offsets.position.y, Math.pow( c, 2 ) + offsets.position.z );
                    arrays.rotation.push( angle, offsets.rotation.y, offsets.rotation.z );
                break;
            }
        }

        return { position: new Float32Array( arrays.position ), rotation: new Float32Array( arrays.rotation ) };
    },

    this.sphere = function()
    {
        var args = arguments[ 0 ];
        var offsets = offset( args.parameters.offsets );
        var arrays =
        {
            unique: [],
            position: [],
            rotation: []
        };
        var phi, theta;
        var x, y, z;
        var tangentX, tangentY, tangentZ;
        var pos = [];
        var d360 = Math.PI * 2;
        var d180 = Math.PI;
        var d90 = Math.PI / 2;
        var cap = false;

        for ( var p = 0; p <= args.parameters.stacks; p++ )
        {
            // stacks
            phi = d180 * p / args.parameters.stacks;

            for ( var t = 0; t < args.parameters.slices; t++ )
            {
                var predicate = true;

                // slices
                theta = d360 * t / args.parameters.slices;

                x = precision( Math.cos( theta ) * Math.sin( phi ), 3 ) * args.parameters.scale.x + offsets.position.x;
                y = precision( Math.cos( phi ), 3 )                     * args.parameters.scale.y + offsets.position.y;
                z = precision( Math.sin( theta ) * Math.sin( phi ), 3 ) * args.parameters.scale.z + offsets.position.z;

                pos = [ x, y, z ];

                // caps - both sin and cos are 0
                cap = !( precision( Math.sin( phi ), 0 ) || precision( Math.cos( theta ), 0 ) );

                tangentX = - Math.sign( Math.sin( theta ) ) * Math.tan( y );
                tangentY = d90 - theta;
                tangentZ = 0;

                //if ( predicate ) console.log( p, t, degrees( theta ), degrees( tangentY ), Math.sign( Math.sin( phi ) ) );

                // add only once
                if ( !hash( arrays.unique, pos ) && predicate )
                {
                    arrays.unique.push( pos );

                    arrays.position.push( x, y, z );
                    arrays.rotation.push( tangentX, tangentY, tangentZ );
                }
            }
        }

        return { position: new Float32Array( arrays.position ), rotation: new Float32Array( arrays.rotation ) };
    };

    this.spiral = function()
    {
        var args = arguments[ 0 ];
        var arrays =
        {
            position: [],
            rotation: []
        };
        var angle = 0;
        var circle = Math.PI * 2;
        var s = args.parameters.spacing * args.parameters.scale[ args.parameters.axis ];
        var h = args.parameters.stacks * args.parameters.slices;
        var v = -args.parameters.stacks * s;
        var increment = s / args.parameters.stacks;

        while ( h > 0 )
        {
            h--;
            v += increment + args.parameters.radius.i;
            angle = circle * h / args.parameters.slices % circle;

            spiral( { arrays: arrays, data: { angle: angle, v: v, parameters: args.parameters } } );
        }

        return { position: new Float32Array( arrays.position ), rotation: new Float32Array( arrays.rotation ) };
    };
};

