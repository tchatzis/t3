( function()
{
    var scripts = [ "lib/three", "t3", "t3.Controls", "t3.Animations", "t3.Prefabs", "t3.Objects", "t3.Vertices", "t3.Timer", "custom/characters", "widgets" ];
    var tag;
    var s = 0;

    var error = function( event )
    {
        console.error( event.type, "loading", event.target.src );
        next();
    };

    var next = function()
    {
        if ( s < scripts.length ) s++;
        
        if ( scripts[ s ] ) 
        {
            load();
        }
        else
        {
            var widgets = new Widgets();
                widgets.t3.init.scene( {} );
        }
    };

    var load = function()
    {
        tag = document.createElement( "script" );
        tag.src = "/js/" + scripts[ s ] + ".js";
        tag.type = "text/javascript";
        tag.addEventListener( "load", next );
        tag.addEventListener( "error", error );

        document.head.appendChild( tag );
    }

    load();
} )();

// set globals
Array.prototype.extend = function( array )
{
    array.forEach( function( item )
    {
        this.push( item )
    }, this );
};