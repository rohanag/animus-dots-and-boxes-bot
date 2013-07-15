//TODO:: Count long chains, give away the least long chain, THEN implement even odd chains

//java -Djruby.compat.version=1.9 -jar local_tournament.jar 10

// Globals for interal use
var valid_moves = [];
var connections = [];

var connections2d = new Array(101);
  for (var x = 0; x < 101; x++) {
    connections2d[x] = new Array(101);
	for (var y = 0; y < 101; y++) {
		connections2d[x][y] = 0;
	}
  }

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

// function finddot(dot1, dot2)
// {
// // return 1 if dot1, dot2 is present in connections
	// var i;
	// for (i = 0; i < connections.length; i += 1) 
	// {
		// if (connections[i][0] == dot1 && connections[i][1] == dot2)
			// return 1;
		// else if (connections[i][0] == dot2 && connections[i][1] == dot1)
			// return 1;
    // }
	// return 0;
// }
function finddot(dot1, dot2)
{
// return 1 if dot1, dot2 is present in connections
	if ( connections2d[dot1][dot2] == 1 || connections2d[dot2][dot1] == 1)
		return 1;
	
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
// If funtion can't find a valid box making move, return 10000, which really shouldn't be possible,
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


function makesafe()
{
// return index of a safe move ( a move that does not lead to side == 3
// else return 10000, which the function should not
	
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
				connections2d[i][j] = 1;
				connections2d[j][i] = 1;
				if ( !ischance() )	
				{
					connections2d[i][j] = 0;
					connections2d[j][i] = 0;
					return findvalidindex( i , j );
				}
				connections2d[i][j] = 0;
				connections2d[j][i] = 0;
			}
			//====================================
			j = i + length;
			if ( !finddot( i , j ) )
			{
				connections2d[i][j] = 1;
				connections2d[j][i] = 1;
				if ( !ischance() )	
				{
					connections2d[i][j] = 0;
					connections2d[j][i] = 0;
					return findvalidindex( i , j );
				}
				connections2d[i][j] = 0;
				connections2d[j][i] = 0;
			}
			//====================================
			j = i + 1 + length;
			if ( !finddot( i + 1 , j ) )
			{
				connections2d[i+1][j] = 1;
				connections2d[j][i+1] = 1;
				if ( !ischance() )	
				{
					connections2d[i+1][j] = 0;
					connections2d[j][i+1] = 0;
					return findvalidindex( i + 1 , j );
				}
				connections2d[i+1][j] = 0;
				connections2d[j][i+1] = 0;
			}
			//====================================
			j = i + 1 + length;
			if ( !finddot( i + length , j ) )
			{
				connections2d[i+length][j] = 1;
				connections2d[j][i+length] = 1;
				if ( !ischance() )	
				{
					connections2d[i+length][j] = 0;
					connections2d[j][i+length] = 0;
					return findvalidindex( i + length  , j );
				}
			connections2d[i+length][j] = 0;
			connections2d[j][i+length] = 0;
			}
			
		}
	} 
	return 10000;
}

// Called by engine when it's the bots turn to move
function move(board) {
    var i, best_move;
	var even;
	
    turn = board.connections.length + 1;
	
    //print("---------- Turn #" + turn + " ----------");
	
	if ( turn == 1)
	{
	//	print("First Move");
		even=1;
	}
	else if ( turn == 2)
	{
	//	print("Second Move");
		even=0;
	}

	// Clear connections2d
	for (var x = 0; x < 101; x++) {
    	for (var y = 0; y < 101; y++) {
			connections2d[x][y] = 0;
		}
	}
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
		var tempconn = convertArray(board.connections[i]);
		connections2d[tempconn[0]][tempconn[1]] = 1;
		connections2d[tempconn[1]][tempconn[0]] = 1;
		//print("tempconn "+ tempconn[0]+ " " + tempconn[1]);
        //print("Connection #" + i + " [" + connections[i][0] + "," + connections[i][1] + "]");
    }

	
	// for(i=0;i<101;i++)
		// for(j=0;j<101;j++)
			// if(connections2d[i][j]==0)
				// print("notzero "+i+" "+j+" "+connections2d[i][j]);
	
    // ***** INSERT CHOICE HEURISTIC HERE ****************************************************
    // Choose the first move as the best move
	
	best_move = 0;
	
	best_move = makebox();
	if( best_move == 10000 )
	{
		best_move = makesafe();
		if ( best_move == 10000 )
		{
			//print("-----------ERROR2 ERROR2 somethings wrong bestmove is 10000----------");
			//TODO code for even odd long chains
			best_move = 0;
		}
	}	
	
    

    return board.valid_moves[best_move];
} 