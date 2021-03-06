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
		else if (connections[i][0] == dot2 && connections[i][1] == dot1)
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
		else if (valid_moves[i][0] == dot2 && valid_moves[i][1] == dot1)
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
	//print("ischanceloop connections:"+connections);
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
			//print("checkischanceloop :"+i+" "+sides);
			if  ( sides == 3 )
				return 1;
		}
	} 
	return 0;
}

function issafe()
{
// returns 0 if board is not safe ::::: TODO: consider even and odd chains
// returns 1 if safe move is possible ( a move which leaves the board without sides == 3 )
	
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
				//print("---"+connections+"----");
				connections.push( i , j );
				//print("---"+connections+"----"+i+"="+j);
				if ( !ischance() )	
				{
					connections.pop();
					connections.pop();
					//print("---"+connections+"----");
					return 1;
				}
				connections.pop();
				connections.pop();
			}
			//====================================
			j = i + length;
			if ( !finddot( i , j ) )
			{
				connections.push( i , j );
				if ( !ischance() )	
				{
					connections.pop();
					connections.pop();
					return 1;
				}
				connections.pop();
				connections.pop();
			}
			//====================================
			j = i + 1 + length;
			if ( !finddot( i + 1 , j ) )
			{
				connections.push( i + 1 , j );
				if ( !ischance() )	
				{
					connections.pop();
					connections.pop();
					return 1;
				}
				connections.pop();
				connections.pop();
			}
			//====================================
			j = i + 1 + length;
			if ( !finddot( i + length , j ) )
			{
				connections.push( i + length  , j );
				if ( !ischance() )	
				{
					connections.pop();
					connections.pop();
					return 1;
				}
				connections.pop();
				connections.pop();
			}
			
		}
	} 
	return 0;
}

function makesafe()
{
// return index of a safe move ( a move that does not lead to side == 3
// else return 10000, which the function should not, because issafe suggested a safe move was possible
	
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
				var tempvar=[i,j];
				connections.push( tempvar );
				if ( !ischance() )	
				{
					connections.pop();
					connections.pop();
					return findvalidindex( i , j );
				}
				//connections.pop();
				connections.pop();
			}
			//====================================
			j = i + length;
			if ( !finddot( i , j ) )
			{
				var tempvar=[i,j];
				connections.push( tempvar );
				if ( !ischance() )	
				{
					connections.pop();
					connections.pop();
					return findvalidindex( i , j );
				}
				//connections.pop();
				connections.pop();
			}
			//====================================
			j = i + 1 + length;
			if ( !finddot( i + 1 , j ) )
			{
				var tempvar=[i+1,j];
				connections.push( tempvar );
				if ( !ischance() )	
				{
					connections.pop();
					connections.pop();
					return findvalidindex( i + 1 , j );
				}
				//connections.pop();
				connections.pop();
			}
			//====================================
			j = i + 1 + length;
			if ( !finddot( i + length , j ) )
			{
				var tempvar=[i + length  , j];
				connections.push( tempvar );
				if ( !ischance() )	
				{
					connections.pop();
					connections.pop();
					return findvalidindex( i + length  , j );
				}
				//connections.pop();
				connections.pop();
			}
			
		}
	} 
	return 10000;
}

// Called by engine when it's the bots turn to move
function move(board) {
    var i, best_move;
    turn = board.connections.length + 1;
    //print("---------- Turn #" + turn + " ----------");
	if ( turn == 1)
		print("First Move");
	else if ( turn == 2)
		print("Second Move");

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
		//print("connections: "+connections);
		//print("-------- i attack---------" + valid_moves[best_move]);
		if ( best_move == 10000 )
		{
			print("-------------------------ERROR1 ERROR1 somethings wrong bestmove is 1000-----------------------------");
			best_move = 0;
		}
	}
	// else if ( issafe() )
	// {
		// best_move = makesafe();
		// print("-------- i am safe---------" + valid_moves[best_move]);
		// if ( best_move == 10000 )
		// {
			// print("-------------------------ERROR2 ERROR2 somethings wrong bestmove is 1000-----------------------------");
			// best_move = 0;
		// }
	// }	
	else 
	{
		best_move = makesafe();
		
		if ( best_move == 10000 )
		{
			//print("connections: "+connections);
			//print("-------------------------NO SAFE MOVE LEFT-----------------------------");
			best_move = 0;
		}
		else
		{
			//print("connections: "+connections);
			//print("-------- i am safe---------" + valid_moves[best_move]);
		}
	}	
	// else
		// best_move = 0;

    

    return board.valid_moves[best_move];
} 