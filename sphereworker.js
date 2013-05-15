function RequireScript ( path ) {
    importScripts( path );
}

function Delay( ms ) {
    var time = new Date().getTime();
    while ( new Date().getTime() - time < ms );
}

function FlipScreen() {
    postMessage( "FS" );
}

self.addEventListener( "message", function ( event ) {
} );


importScripts( "startup/scripts/main.js" );
game();