function game(){
    while ( true ) {

        Rectangle( 0, 0, 100, 100, CreateColor( 255, 0, 0 ) );
        Rectangle( 50, 50, 100, 100, CreateColor( 0, 0, 255, 200 ) );

        Delay( 100 );
        FlipScreen();
    }
    
}