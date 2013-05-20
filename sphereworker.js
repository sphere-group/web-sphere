( function () {

    var firstCommand = null;

    function getCommandsAsString() {
        var string = "";
        while ( firstCommand ) {
            string += firstCommand.string + ";";
            firstCommand = firstCommand.next;
        }
        return string;
    }

    function queueCommand( string ) {
        var command = { string: string, next: null };
        if ( firstCommand ) {
            firstCommand.next = command
        } else {
            firstCommand = command;
        }
    }

    Color = function ( r, g, b, a ) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a || 255;
    }

    CreateColor = function ( r, g, b, a ) {
        return new Color( r, g, b, a );
    }

    RequireScript = function ( path ) {
        importScripts( path );
    }

    Delay = function ( ms ) {
        var time = new Date().getTime();
        while ( new Date().getTime() - time < ms );
    }

    FlipScreen = function () {
        postMessage( getCommandsAsString() );
        firstCommand = null;
    }

    Rectangle = function ( x, y, w, h, c ) {
        queueCommand( "Rectangle:" + x + "," + y + "," + w + "," + h + "," + c.red + "," + c.green + "," + c.blue + "," + c.alpha );
    }

} )();

self.addEventListener( "message", function ( event ) {
} );


importScripts( "startup/scripts/main.js" );
game();