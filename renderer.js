/// <reference path="three.js" />

( function () {

    Renderer = {};

    var width = 640;
    var height = 480;
    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera( width / -2, width / 2, height / 2, height / -2, -10, 10 );
    var renderer = new THREE.WebGLRenderer();

    var firstQuad = null;
    var currentQuad = null;

    renderer.setSize( 640, 480 );
    renderer.setClearColor( 0, 1 );
    renderer.domElement.style = "width: " + width + "px; height: " + height + "px";

    camera.position.z = -5;
    camera.position.x = width / 2;
    camera.position.y = height / 2;
    camera.scale.y = -1;

    Renderer.init = function () {
        document.body.appendChild( renderer.domElement );
    }

    Renderer.render = function () {
        renderer.render( scene, camera );
        currentQuad = firstQuad;
    }

    function Quad() {
        this.a = { x: 0, y: 0, u: 0, v: 0, r: 1, g: 0, b: 0, a: 1 };
        this.b = { x: 0, y: 0, u: 0, v: 0, r: 0, g: 1, b: 0, a: 1 };
        this.c = { x: 0, y: 0, u: 0, v: 0, r: 0, g: 0, b: 1, a: 1 };
        this.d = { x: 0, y: 0, u: 0, v: 0, r: 0, g: 0, b: 0, a: 0.5 };
        this.nextQuad = null;
        this.frameId = -1;
        this.geometry = null;
        this.material = null;
        this.index = -1;
    }
    
    Quad.prototype.update = function() {
        this.geometry.vertices[0].x = this.a.x;
        this.geometry.vertices[0].y = this.a.y;

        this.geometry.vertices[1].x = this.b.x;
        this.geometry.vertices[1].y = this.b.y;

        this.geometry.vertices[2].x = this.c.x;
        this.geometry.vertices[2].y = this.c.y;

        this.geometry.vertices[3].x = this.d.x;
        this.geometry.vertices[3].y = this.d.y;

        this.geometry.buffersNeedUpdate = true;
    }

    function addQuad( x1, y1, x2, y2, x3, y3, x4, y4 ) {
        if ( !currentQuad ) {
            firstQuad = currentQuad = createQuadInScene();
        }

        currentQuad.a.x = x1;
        currentQuad.a.y = y1;
        currentQuad.b.x = x2;
        currentQuad.b.y = y2;
        currentQuad.c.x = x3;
        currentQuad.c.y = y3;
        currentQuad.d.x = x4;
        currentQuad.d.y = y4;
        currentQuad.update();
        
        if ( !currentQuad.nextQuad ) {
            currentQuad.nextQuad = createQuadInScene();
        }
        currentQuad = currentQuad.nextQuad;
    }

    function createQuadInScene() {
        var quad = new Quad();

        quad.geometry = new THREE.Geometry();
        quad.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        quad.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        quad.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        quad.geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        quad.geometry.faces.push( new THREE.Face4( 0, 1, 2, 3 ) );

        var attributes = {
            rgba: {
                type: "v4", value: [
                    new THREE.Vector4( 1, 0, 0, 0.5 ),
                    new THREE.Vector4( 0, 1, 0, 0.5 ),
                    new THREE.Vector4( 0, 0, 1, 0.5 ),
                    new THREE.Vector4( 0, 0, 0, 0.5 )
                ]
            }
        };
        var uniforms = {
            test: { type: "f", value: 0.0 },
        };

        var vertShader = document.getElementById( 'vertexshader' ).innerHTML;
        var fragShader = document.getElementById( 'fragmentshader' ).innerHTML;

        quad.material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            attributes: attributes,
            vertexShader: vertShader,
            fragmentShader: fragShader,
            transparent: true,
            side: THREE.DoubleSide
        } );

        scene.add( new THREE.Mesh( quad.geometry, quad.material ) );

        return quad;
    }

    Renderer.Sphere = {};

    Renderer.Sphere.Rectangle = function ( x, y, w, h, r, g, b, a ) {
        x = parseInt( x );
        y = parseInt( y );
        w = parseInt( w );
        h = parseInt( h );
        r = parseInt( r );
        g = parseInt( g );
        b = parseInt( b );
        a = parseInt( a );
        addQuad( x, y, x + w, y, x + w, y + h, x, y + h );
    }

} )();