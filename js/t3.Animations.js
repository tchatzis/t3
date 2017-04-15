t3.Animations = function()
{
    var duration = function( animations )
    {
        var duration = 0;
        var infinite = [];
        var index = 0;

        if( animations )
        {
            for ( var a = 0; a < animations.length; a++ )
            {
                if ( animations[ a ].duration < Infinity )
                {
                    duration = Math.max( animations[ a ].duration, duration );
                }
                else
                {
                    infinite.push( true );
                }

                if ( animations[ a ].duration > duration )
                {
                    index = animations[ a ].index;
                }
            }

            console.log( animations );
        }

        return { duration: duration, index: index, infinite: infinite };
    };

    var fraction = function( animation )
    {
        return animation.timer.elapsed /animation.duration;
    };

    var increment = function( animation )
    {
        var duration = animation.duration === Infinity ? 1 : animation.duration;
        var speed = animation.duration === Infinity ? animation.speed ? animation.speed : 1 : 1;

        return animation.units * speed / Math.abs( duration );
    };

    var orientation = function()
    {
        var args = arguments[ 0 ];
        var vector = {};

        switch ( args.animation.axis )
        {
            case "x":
                vector = new THREE.Vector3( 0, Math.sin( args.angle ) * args.animation.units, Math.cos( args.angle ) * args.animation.units );
            break;

            case "y":
                vector = new THREE.Vector3( Math.sin( args.angle ) * args.animation.units, 0, Math.cos( args.angle ) * args.animation.units );
            break;

            case "z":
                vector = new THREE.Vector3( Math.sin( args.angle ) * args.animation.units, Math.cos( args.angle ) * args.animation.units, 0 );
            break;
        }

        return vector;
    };

    var position = function( args, vector )
    {
        if ( args.animation.start ) vector.add( args.animation.start );

        for ( var axis in vector )
        {
            if ( vector.hasOwnProperty( axis ) )
            {
                args.object.position[ axis ] = vector[ axis ];
            }
        }
    };

    var next = function( object, animation )
    {
        //var d = duration( object.animations[ t3.utils.store.animations.index ] );
        //console.log( d.duration );

        if ( object.animations.length > t3.utils.store.animations.index )
        {
            t3.utils.store.animations.index++;
        }
        /*else
        {
            //console.warn( t3.utils.store.animations.index );
            //console.log( t3.utils.store.animations.index, animation.name, animation.index, d.index, d.infinite.indexOf( true ) );

            if ( animation.index === d.index && d.infinite.indexOf( true ) === -1 )
            {
                //console.log( "remove", object );
                //t3.handles.props.scene.remove( object );
            }
        }*/
    };

    var run = function( animation )
    {
        if ( !animation.duration )
            return true;

        if ( animation.duration && animation.timer.elapsed < animation.duration )
            return true;

        return false;
    };

    // API
    this.bezier = function()
    {
        var args = arguments[ 0 ];
        var vector;

        if ( run( args.animation ) )
        {
            var t = fraction( args.animation );
            var i = 1 - t;

            var coord = function( h, v )
            {
                return { h: h || 0, v: v || 0 };
            };

            var f = [];
                f[ 0 ] = function( t ) { return t * t * t };
                f[ 1 ] = function( t ) { return 3 * t * t * ( 1 - t ) };
                f[ 2 ] = function( t ) { return 3 * t * ( 1 - t ) * ( 1 - t ) };
                f[ 3 ] = function( t ) { return ( 1 - t ) * ( 1 - t ) * ( 1 - t ) };

            var bezier = function( d )
            {
                var pos = new coord();
                var c = {};

                for ( var n = 0; n < args.animation.data.length; n++ )
                {
                    c = coord( args.animation.data[ n ][ 0 ], args.animation.data[ n ][ 1 ] );

                    pos.h += c.h * f[ n ]( d );
                    pos.v += c.v * f[ n ]( d );
                }

                return pos;
            }

            var p = bezier( i );
                p.d = args.animation.units * t;

            switch ( args.animation.axis )
            {
                case "x":
                    vector = new THREE.Vector3( p.d, p.h, p.v );
                break;

                case "y":
                    vector = new THREE.Vector3( p.h, p.d, p.v );
                break;

                case "z":
                    vector = new THREE.Vector3( p.h, p.v, p.d );
                break;
            }

            position( args, vector );

            args.animation.timer.update();
            args.animation.index = args.index;
        }
        else
        {
            next( args.object, args.animation );
        }
    };

    this.fade = function()
    {
        var args = arguments[ 0 ];
        var c = args.object.children.length;
        var i = ( increment( args.animation ) * args.animation.timer.elapsed ) % 1;
        var material;

        //console.log( c, i, args );

        args.animation.opacity = ( args.animation.units < 0 ) ? -args.animation.units : 0;
        args.animation.opacity += i;

        if ( run( args.animation ) )
        {
            if ( c > 0 )
            {
                while ( c > 0 )
                {
                    c--;
                    material = args.object.children[ c ].material;

                    if ( material )
                    {
                        material.transparent = true;
                        material.opacity = args.animation.opacity;
                    }
                }
            }
            else
            {
                material = args.object.material;

                if ( material )
                {
                    material.transparent = true;
                    material.opacity = args.animation.opacity;
                }
            }

            args.animation.timer.update();
            args.animation.index = args.index;
        }
        else
        {
            next( args.object, args.animation );
        }
    };

    this.hsl = function()
    {
        var args = arguments[ 0 ];
        var c = args.object.children.length;
        var i = ( increment( args.animation ) * args.animation.timer.elapsed + args.animation.start[ args.animation.axis ] ) % 1;

        var component = function( color, i )
        {
            switch ( args.animation.axis )
            {
                case "h":
                    color.setHSL( i, args.animation.start.s, args.animation.start.l );
                break;

                case "s":
                    color.setHSL( args.animation.start.h, i, args.animation.start.l );
                break;

                case "l":
                    color.setHSL( args.animation.start.h, args.animation.start.s, i );
                break;
            }
        };

        if ( run( args.animation ) )
        {
            if ( c > 0 )
            {
                while ( c > 0 )
                {
                    c--;
                    component( args.object.children[ c ].material.color, i );
                }
            }
            else
            {
                switch ( args.object.type )
                {
                    case "PointLight":
                        component( args.object.color, i );
                        break;
                }
            }

            args.animation.timer.update();
            args.animation.index = args.index;
        }
        else
        {
            next( args.object, args.animation );
        }
    };

    this.next = next;

    this.orbit = function()
    {
        var args = arguments[ 0 ];
        var angle = 0;
        var vector = {};

        if ( run( args.animation ) )
        {
            angle = increment( args.animation ) * args.animation.timer.elapsed;
            vector = orientation( { animation: args.animation, angle: angle } );

            position( args, vector );

            args.animation.timer.update();
            args.animation.index = args.index;
        }
        else
        {
            next( args.object, args.animation );
        }
    };

    this.pause = function()
    {
        var args = arguments[ 0 ];

        if ( run( args.animation ) )
        {
            args.object.needsUpdate = false;
            args.animation.timer.update();
            args.animation.index = args.index;
        }
        else
        {
            next( args.object, args.animation );
        }
    };

    this.rotate = function()
    {
        var args = arguments[ 0 ];

        if ( run( args.animation ) )
        {
            args.object.rotation[ args.animation.axis ] = increment( args.animation ) * Math.PI * 2 * args.animation.timer.elapsed;
            args.animation.timer.update();
            args.animation.index = args.index;
        }
        else
        {
            next( args.object, args.animation );
        }
    };

    this.scale = function()
    {
        var args = arguments[ 0 ];
        var increment = 0;

        if ( run( args.animation ) )
        {
            args.object.scale[ args.animation.axis ] = increment( args.animation ) * args.animation.timer.elapsed + 1;
            args.animation.timer.update();
            args.animation.index = args.index;
        }
        else
        {
            next( args.object, args.animation );
        }
    };

    this.translate = function()
    {
        var args = arguments[ 0 ];

        if ( run( args.animation ) )
        {
            args.object.position[ args.animation.axis ] = increment( args.animation ) * args.animation.timer.elapsed;
            args.animation.timer.update();
            args.animation.index = args.index;
        }
        else
        {
            next( args.object, args.animation );
        }
    };
};
