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



var Sphere = {};
(function(){

    var worker = null;

    Sphere.run = function() {

        worker = new Worker( "sphereworker.js" );

        worker.addEventListener( "message", function ( event ) {
            console.info( event.data );
        }, false );
    }


})();