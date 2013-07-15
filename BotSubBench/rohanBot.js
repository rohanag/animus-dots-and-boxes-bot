// Globals for interal use
var valid_moves = [];
var connections = [];
var turn;

// Convert the passed object to a 2 element array of integers
function convertArray(objArray) {
    var i, strString, splitArray;

    // Use the toString to get the value of object
    strString = '' + objArray.toString();

    // Take off the open and close square bracket
    strString = strString.substring(1, strString.length - 1);

    // Split the object by commas
    splitArray = strString.split(",");

    // Convert array of strings to array of integers
    for (i = 0; i < splitArray.length; i += 1) {
        splitArray[i] = parseInt(splitArray[i], 10);
    }
    return splitArray;
}

function finddot(dot1, dot2)
{
// return 1 if dot1, dot2 is present in connections
	var i;
	for (i = 0; i < connections.length; i += 1) 
	{
		if (connections[i][0] == dot1 && connections[i][1] == dot2)
			return 1;

    }
	return 0;
}

function findvalidindex(dot1, dot2)
{
// return index in valid_move where firstdot = dot1 and seconddot = dot2
// return 10000 if not found, since 0 is a valid index
	var i;
	for (i = 0; i < valid_moves.length; i += 1) 
	{
		if (valid_moves[i][0] == dot1 && valid_moves[i][1] == dot2)
			return i;

    }
	return 10000;
}

function makebox()
{
// If funtion can't find a valid box making move, return 10000, which really shouldn't be possible, because ischance had already
// found a box making oppurtunity
	var sides = 0;
	var i = 0;
	var length = board.size;
	for ( i = 1; i < length * ( length - 1 ); i++ )		// i < 90 , here length = 10
	{
		sides = 0;
		if ( i % length != 0 || (i + ( i % length ) ) / length == length )
		{
			if ( finddot( i , i + 1) )
				sides = sides + 1 ;
			if ( finddot( i , i + length) )
				sides = sides + 1 ;
			if ( finddot( i + 1 , i + 1 + length ) )
				sides = sides + 1 ;
			if ( finddot( i + length , i + 1 + length ) )
				sides = sides + 1 ;
			if  ( sides ==3 )
			{
				if ( !finddot( i , i + 1) )
					return findvalidindex(i , i + 1);
				if ( !finddot( i , i + length) )
					return findvalidindex(i , i + length);
				if ( !finddot( i + 1 , i + 1 + length ) )
					return findvalidindex( i + 1 , i + 1 + length );
				if ( !finddot( i + length , i + 1 + length ) )
					return findvalidindex( i + length , i + 1 + length );
			}
		}
	} 
	return 10000;
}

function ischance()
{
// returns 0 if no chance to make a box i.e sides = 0 or 1 or 2
// returns 1 if sides == 3
	var sides = 0;
	var i = 0;
	var length = board.size;
	for ( i = 1; i < length * ( length - 1 ); i++ )		// i < 90
	{
		sides = 0;
		if ( ( i % length != 0 ) || ( ( i + length - ( i % length ) ) / length ) == length )	
		//excluding elements (10 , 20 ... 100) OR (90 , 91 ... 100)
		{
			if ( finddot( i , i + 1) )
				sides = sides + 1 ;
			if ( finddot( i , i + length) )
				sides = sides + 1 ;
			if ( finddot( i + 1 , i + 1 + length ) )
				sides = sides + 1 ;
			if ( finddot( i + length , i + 1 + length ) )
				sides = sides + 1 ;
			if  ( sides == 3 )
				return 1;
		}
	} 
	return 0;
}

function issafe()
{
// returns 0 if board is not safe ::::: TODO: consider even and odd chains
// returns 1 if safe move is possible ( without leaving sides == 3 )
	
	var i = 0, j = 0;
	var length = board.size;
	for ( i = 1; i < length * ( length - 1 ); i++ )		// i < 90
	{
		if ( ( i % length != 0 ) || ( ( i + length - ( i % length ) ) / length ) == length )	
		//excluding elements (10 , 20 ... 100) OR (90 , 91 ... 100)
		{
			
			j = i + 1;
			if ( !finddot( i , j ) )
			{
				connections.push( i , j );
				if ( !ischance() )	
				{
					connections.pop();
					return 1;
				}
			}
			//====================================
			j = i + length;
			if ( !finddot( i , j ) )
			{
				connections.push( i , j );
				if ( !ischance() )	
				{
					connections.pop();
					return 1;
				}
			}
			//====================================
			j = i + 1 + length;
			if ( !finddot( i + 1 , j ) )
			{
				connections.push( i + 1 , j );
				if ( !ischance() )	
				{
					connections.pop();
					return 1;
				}
			}
			//====================================
			j = i + 1 + length;
			if ( !finddot( i + length , j ) )
			{
				connections.push( i + length  , j );
				if ( !ischance() )	
				{
					connections.pop();
					return 1;
				}
			}
			
		}
	} 
	return 0;
}

// Called by engine when it's the bots turn to move
function move(board) {
    var i, best_move;
    turn = board.connections.length + 1;
    //print("---------- Turn #" + turn + " ----------");

    // Clear old data and sync up valid moves
    valid_moves.length = 0;
    for (i = 0; i < board.valid_moves.length; i += 1) {
        valid_moves.push(convertArray(board.valid_moves[i]));
        //print("Valid move #" + i + " [" + valid_moves[i][0] + "," + valid_moves[i][1] + "]");
    }

    // Clear old data and sync up connections
    connections.length = 0;
    for (i = 0; i < board.connections.length; i += 1) {
        connections.push(convertArray(board.connections[i]));
        //print("Connection #" + i + " [" + connections[i][0] + "," + connections[i][1] + "]");
		// if (finddot(connections[i][0],connections[i][1]))
			// print("found dot");
		// else
			// print("waaaaaaaaatttttttttt");
    }

    // ***** INSERT CHOICE HEURISTIC HERE *****
    // Choose the first move as the best move
	
	best_move = 0;

	if( ischance() == 1 )
	{
		best_move = makebox();
		if ( best_move == 10000 )
		{
			print("-------------------------ERRORERROR somethings wrong bestmove is 1000-----------------------------");
			best_move = 0;
		}
	}
	else 
		best_move = 0;

    

    return board.valid_moves[best_move];
} 