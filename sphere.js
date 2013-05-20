/// <reference path="renderer.js" />

window.requestAnimFrame = ( function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function ( callback ) {
                window.setTimeout( callback, 1000 / 60 );
            };
} )();

(function(){

    Sphere = {};

    var worker = null;
    var currentCommands = "";

    Sphere.run = function() {

        worker = new Worker( "sphereworker.js" );

        worker.addEventListener( "message", function ( event ) {
            currentCommands = event.data;
        }, false );

        renderCommands();
    }

    function renderCommands() {
        handleCommandString( currentCommands );
        Renderer.render();
        requestAnimFrame( renderCommands );
    }

    function handleCommandString( string ) {
        var commands = string.split( ";" );
        var index = 0;
        var length = commands.length;
        for ( index = 0; index < length; index++ ) {
            handleCommand( commands[index] );
        }
    }

    function handleCommand( string ) {
        if ( !string || string.length == 0 ) return;
        var parts = string.split( ":" );
        if ( parts.length == 2 ) {
            var command = parts[0];
            var arguments = parts[1].split( "," );
            Renderer.Sphere[command].apply( null, arguments );
        }
    }

})();