//TODO:: Count long chains, give away the least long chain, THEN implement even odd chains

// make doublecrossing foolproof
// avoid it on the last turn, turn = 180

// if there are no small chains, and danger = 1
// call doublecross instead of makebox
// make global variable dblcross, 2d array of the sides involved.
// if dblcross is empty, populate it with makeboxdblcross
// if dblcross.length == 2, then do the dablcross

//java -Djruby.compat.version=1.9 -jar local_tournament.jar 10

// Globals for interal use
var valid_moves = [];
var connections = [];
var skipem = [];
var movestore = [];
var safemoves = [];
var printt = 0;

var connections2d = new Array(101);
  for (var x = 0; x < 101; x++) {
    connections2d[x] = new Array(101);
	for (var y = 0; y < 101; y++) {
		connections2d[x][y] = 0;
	}
  }

var turn;
var danger = 0;

function clone(o) {
 return eval(uneval(o));
}

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

function skip(dot1, dot2)
{
// return 1 if dot1, dot2 is present in skipem
	var i;
	for (i = 0; i < skipem.length; i += 1) 
	{
		if (skipem[i][0] == dot1 && skipem[i][1] == dot2)
			return 1;
		else if (skipem[i][0] == dot2 && skipem[i][1] == dot1)
			return 1;
    }
	return 0;
}
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
	safemoves.length=0;
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
					safemoves.push(findvalidindex( i , j ));
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
					safemoves.push(findvalidindex( i , j ));
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
					safemoves.push(findvalidindex( i+1 , j ));
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
					safemoves.push(findvalidindex( i+length , j ));
				}
			connections2d[i+length][j] = 0;
			connections2d[j][i+length] = 0;
			}
			
		}
		if (safemoves.length > 100)
			return safemoves[Math.floor(Math.random() * safemoves.length)];
	} 
	if ( safemoves.length == 0)
		return 10000;
	else
		return safemoves[Math.floor(Math.random() * safemoves.length)];
}

function makebox2(conn)
{
// VERSION 2 for finding chainlength
	var sides = 0;
	var i = 0;
	var chain = 0;
	var length = board.size;
	for ( i = 1; i < length * ( length - 1 ); i++ )		// i < 90 , here length = 10
	{
		sides = 0;
		if ( i % length != 0 || (i + ( i % length ) ) / length == length )
		{

			if ( conn[i][i+1] == 1 )
				sides = sides + 1 ;
			if ( conn[i][i+length] == 1 )
				sides = sides + 1 ;
			if ( conn[ i + 1 + length][i+1] == 1 )
				sides = sides + 1 ;
			if ( conn[i + length][i + 1 + length] == 1 )
				sides = sides + 1 ;
			if  ( sides == 3 )
			{
				if ( conn[i][i+1] == 0 )
				{
					conn[i][i + 1]=1;
					conn[i+1][i] = 1;
					var temp=[i,i+1];
					skipem.push(temp);
				}
				else if ( conn[i][i+length] == 0)
				{
					conn[i][i+length]=1;
					conn[i+length][i] =1;
					var temp=[i,i+length];
					skipem.push(temp);
					
				}
				else if ( conn[ i + 1 + length][i+1] == 0)
				{
					conn[ i + 1 + length][i+1] =1;
					conn[i+1][i + 1 + length] =1;
					var temp=[i+1+length,i+1];
					skipem.push(temp);
					
				}
				else if ( conn[i + length][i + 1 + length] == 0)
				{
					conn[i + length][i + 1 + length] =1;
					conn[i + 1 + length][i + length] =1;
					var temp=[i+length,i+1+length];
					skipem.push(temp);
					
				}
				//print (temp);
				chain = chain + 1;
				sides = 0;
				i = 0 ;
			}
		}
	} 
	//print("skipem "+skipem);
	return chain;
}


function makeboxdbl(conn)
{
// store chain of moves in movestore
	var sides = 0;
	var i = 0;
	var chain = 0;
	var length = board.size;
	for ( i = 1; i < length * ( length - 1 ); i++ )		// i < 90 , here length = 10
	{
		sides = 0;
		if ( i % length != 0 || (i + ( i % length ) ) / length == length )
		{

			if ( conn[i][i+1] == 1 )
				sides = sides + 1 ;
			if ( conn[i][i+length] == 1 )
				sides = sides + 1 ;
			if ( conn[ i + 1 + length][i+1] == 1 )
				sides = sides + 1 ;
			if ( conn[i + length][i + 1 + length] == 1 )
				sides = sides + 1 ;
			if  ( sides == 3 )
			{
				if ( conn[i][i+1] == 0 )
				{
					conn[i][i + 1]=1;
					conn[i+1][i] = 1;
					var temp=[i,i+1];
					movestore.push(temp);
				}
				else if ( conn[i][i+length] == 0)
				{
					conn[i][i+length]=1;
					conn[i+length][i] =1;
					var temp=[i,i+length];
					movestore.push(temp);
					
				}
				else if ( conn[ i + 1 + length][i+1] == 0)
				{
					conn[ i + 1 + length][i+1] =1;
					conn[i+1][i + 1 + length] =1;
					var temp=[i+1,i+1+length];
					movestore.push(temp);
					
				}
				else if ( conn[i + length][i + 1 + length] == 0)
				{
					conn[i + length][i + 1 + length] =1;
					conn[i + 1 + length][i + length] =1;
					var temp=[i+length,i+1+length];
					movestore.push(temp);
					
				}
				//print (temp);
				chain = chain + 1;
				sides = 0;
				i = 0 ;
			}
		}
	} 
	//print("skipem "+skipem);
	//return chain;
}


function chainlength()
{
// returns side which gives the least squares
	var i = 0, j = 0;
	var length = board.size;
	var minchain = 10000;
	var minchain2 = 10000;
	var chain = 100001;
	var leastij = [];
	skipem.length = 0;
	for ( i = 1; i < length * ( length - 1 ); i++ )		// i < 90
	{
		if ( ( i % length != 0 ) || ( ( i + length - ( i % length ) ) / length ) == length )
		{
			j = i + 1;
			if ( connections2d[i][j] == 0 && connections2d[j][i] == 0 && !skip(i,j))
			{
				var temp = [i,j];
				skipem.push(temp);
				var conn2d = new Array(101);
				  for (var x = 0; x < 101; x++) {
					conn2d[x] = new Array(101);
					for (var y = 0; y < 101; y++) {
						conn2d[x][y] = connections2d[x][y];		// TODO better would be passing by value
																// connection2d[i][j]=1, pass by val, connection2d[i][j]=0
					}
				  }		
				//var conn2d = new clone(connections2d);				  
				conn2d[i][j] = 1;
				conn2d[j][i] = 1;
				chain = makebox2( conn2d );
				if ( chain < minchain )
				{
					minchain2=minchain;
					minchain = chain;
					leastij = [i,j];
					//print("chain min is "+minchain+" is at "+leastij+" at turn " + turn);
				}	
				else if ( chain <= minchain2 )
				{
					minchain2 = chain;
					//print("chain min2 is " + minchain2 + " is at " + i + "-" + j + " at turn " + turn);
				}
				conn2d[i][j] = 0;
				conn2d[j][i] = 0;
			}
			///////////////////////////////////////////////////////////

			j = i + length;
			if ( connections2d[i][j] == 0 && connections2d[j][i] == 0 && !skip(i,j))
			{
				var temp = [i,j];
				skipem.push(temp);
				var conn2d = new Array(101);
				  for (var x = 0; x < 101; x++) {
					conn2d[x] = new Array(101);
					for (var y = 0; y < 101; y++) {
						conn2d[x][y] = connections2d[x][y];		// TODO better would be passing by value
																//connection2d[i][j]=1, pass by val, connection2d[i][j]=0
					}
				  }		
				conn2d[i][j] = 1;
				conn2d[j][i] = 1;
		
				chain = makebox2( conn2d );
				if ( chain < minchain )
				{
					minchain2=minchain;
					minchain = chain;
					leastij = [i,j];
					//print("chain min is "+minchain+" is at "+leastij+" at turn " + turn);
				}		
				else if ( chain <= minchain2 )
				{
					minchain2 = chain;
					//print("chain min2 is " + minchain2 + " is at " + i + "-" + j + " at turn " + turn);

				}
				conn2d[i][j] = 0;								
				conn2d[j][i] = 0;
			}
			/////////////////////////////////////////////////////////////

			j = i + length + 1;
			if ( connections2d[i+1][j] == 0 && connections2d[j][i+1] == 0 && !skip(i+1,j))
			{
				var temp = [i+1,j];
				skipem.push(temp);
				var conn2d = new Array(101);
				  for (var x = 0; x < 101; x++) {
					conn2d[x] = new Array(101);
					for (var y = 0; y < 101; y++) {
						conn2d[x][y] = connections2d[x][y];		// TODO better would be passing by value
																//connection2d[i][j]=1, pass by val, connection2d[i][j]=0
					}
				  }		
				conn2d[i+1][j] = 1;
				conn2d[j][i+1] = 1;
				chain = makebox2( conn2d );
				if ( chain < minchain )
				{
					minchain2=minchain;
					minchain = chain;
					leastij = [i+1,j];
					//print("chain min is "+minchain+" is at "+leastij+" at turn " + turn);
				}		
				else if ( chain <= minchain2 )
				{
					minchain2 = chain;
					//print("chain min2 is " + minchain2 + " is at " + (i+1) + "-" + j + " at turn " + turn);
				}
				conn2d[i+1][j] = 0;	//not really needed :p
				conn2d[j][i+1] = 0;
			}
			/////////////////////////////////////////////////////////////

			j = i + length + 1;
			if ( connections2d[i+length][j] == 0 && connections2d[j][i+length] == 0 && !skip(i+length,j))
			{
				var temp = [i+length,j];
				skipem.push(temp);
				var conn2d = new Array(101);
				  for (var x = 0; x < 101; x++) {
					conn2d[x] = new Array(101);
					for (var y = 0; y < 101; y++) {
						conn2d[x][y] = connections2d[x][y];		// TODO better would be passing by value
																//connection2d[i][j]=1, pass by val, connection2d[i][j]=0
					}
				  }			
				conn2d[i+length][j] = 1;
				conn2d[j][i+length] = 1;
				chain = makebox2( conn2d );
				if ( chain < minchain )
				{
					minchain2=minchain;
					minchain = chain;
					leastij = [i+length,j];
					//print("chain min is "+minchain+" is at "+leastij+" at turn " + turn);
				}	
				else if ( chain <= minchain2 )
				{
					minchain2 = chain;
					//print("chain min2 is " + minchain2 + " is at " + (i+length) + "-" + j + " at turn " + turn);
				}
				conn2d[i+length][j] = 0;
				conn2d[j][i+length] = 0;
			}
		}
	}
	//print("chain min is "+minchain);
	if ( minchain2 > 2 )// && danger == 0 )
	{
		danger = 1;
		// if ( printt )
			// print("--turn: "+turn+" "+minchain2+" "+minchain);
	}	
	return leastij;
}

function checkbox()
{
	var i,j,k,l,m,n;
	i = movestore[0][0];
	j = movestore[0][1];
	k = movestore[1][0];
	l = movestore[1][1];
	m = movestore[2][0];
	n = movestore[2][1];
	if ( printt )
		print("c4, "+movestore+" at turn "+turn);
	if ( (k == j) && (j == m) && ( l == m+1 ) && ( j == i+1 ) && ( n == m+10 ) )
	{
		movestore.shift();
		if ( printt )
			print("yaay1 "+i+"-"+j+"-"+k+"-"+l+"-"+m+"-"+n+"-");
	}
	else if ( (k == j) && (j == m) && ( l == m+1 ) && ( j == i+10 ) && ( n == m+10 ) )
	{
		movestore.shift();
		if ( printt )
			print("yaay2 "+i+"-"+j+"-"+k+"-"+l+"-"+m+"-"+n+"-");
	}
	else if ( (l == j) && (j == m) && ( l == k+1 ) && ( j == i+10 ) && ( n == j+10 ) )
	{
		movestore.pop();
		if ( printt )
			print("yaay3 "+i+"-"+j+"-"+k+"-"+l+"-"+m+"-"+n+"-");
	}
	else if ( (l == j) && (j == m) && ( l == i+1 ) && ( n == l+1 ) && ( m == k+10 ) )
	{
		movestore.pop();
		if ( printt )
			print("yaay4 "+i+"-"+j+"-"+k+"-"+l+"-"+m+"-"+n+"-");
	}
}

function checkboxstart()
{
	var i,j,k,l,m,n;
	i = movestore[0][0];
	j = movestore[0][1];
	k = movestore[1][0];
	l = movestore[1][1];
	m = movestore[2][0];
	n = movestore[2][1];
	if ( printt )
		print("c4, "+movestore+" at turn "+turn);
	if ( (k == j) && (j == m) && ( l == m+1 ) && ( j == i+1 ) && ( n == m+10 ) )
	{
		movestore.shift();
		movestore.shift();
		if ( printt )
			print("yaay1 "+i+"-"+j+"-"+k+"-"+l+"-"+m+"-"+n+"-");
	}
	else if ( (k == j) && (j == m) && ( l == m+1 ) && ( j == i+10 ) && ( n == m+10 ) )
	{
		movestore.shift();
		movestore.shift();
		if ( printt )
			print("yaay2 "+i+"-"+j+"-"+k+"-"+l+"-"+m+"-"+n+"-");
	}
	else if ( (l == j) && (j == m) && ( l == k+1 ) && ( j == i+10 ) && ( n == j+10 ) )
	{
		movestore.pop();
		movestore.shift();
		if ( printt )
			print("yaay3 "+i+"-"+j+"-"+k+"-"+l+"-"+m+"-"+n+"-");
	}
	else if ( (l == j) && (j == m) && ( l == i+1 ) && ( n == l+1 ) && ( m == k+10 ) )
	{
		movestore.pop();
		movestore.shift();
		if ( printt )
			print("yaay4 "+i+"-"+j+"-"+k+"-"+l+"-"+m+"-"+n+"-");
	}
}

// Called by engine when it's the bots turn to move
function move(board) {
    var i, best_move;
	var even;
	
	
    turn = board.connections.length + 1;
    //print("---------- Turn #" + turn + " ----------");
	
	if ( turn == 1)
	{
		even=1;
		danger = 0;
	}
	else if ( turn == 2)
	{
		even=0;
		danger = 0;
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
        
    }

    // Clear old data and sync up connections
    connections.length = 0;
    for (i = 0; i < board.connections.length; i += 1) {
        connections.push(convertArray(board.connections[i]));
		var tempconn = convertArray(board.connections[i]);
		connections2d[tempconn[0]][tempconn[1]] = 1;
		connections2d[tempconn[1]][tempconn[0]] = 1;
		
    }

	

	
    // ***** INSERT CHOICE HEURISTIC HERE ****************************************************
    // Choose the first move as the best move
	
	best_move = 0;
	
	
	
	
	if ( danger == 0 )
		best_move = makebox();
	else
	{
	//if the board is not safe anymore
		if ( movestore.length == 0 )
		{
			var conn2d = new Array(101);
			 for (var x = 0; x < 101; x++) {
				conn2d[x] = new Array(101);
				for (var y = 0; y < 101; y++) {
					conn2d[x][y] = connections2d[x][y];		// TODO better would be passing by value
															// connection2d[i][j]=1, pass by val, connection2d[i][j]=0
				}
			  }	
			makeboxdbl(conn2d);
			if ( movestore.length != 0 )
			{
			//Chain making oppurtunity if length > 2
				if ( printt )
					print("movestore : "+movestore);
				if ( movestore.length == 3)
				{
					if ( turn != 178 )
					{
						checkboxstart();	//removes all the elements except the dbl cross
						//checkbox();		//need to remove the first element too and make it one element array
					}
				}
				var temp = movestore[0];
				movestore.shift();
				best_move = findvalidindex(temp[0],temp[1]);
				// if ( best_move == 10000 )
					// if ( printt )
						// print("NOT HAPPENING1: "+temp[0]+"-"+temp[1]);
				// else
					// if ( printt )
						// print("HAPPENING1: "+temp[0]+"-"+temp[1]);
			}
			else
				best_move = 10000;
		}
		else
		{
			//activate later after checkbox workss :: activated
			if ( movestore.length == 3)
			{
				if ( turn != 178 )
				{
					checkbox();
				}
			}
			
			if ( movestore.length == 2 )
			{
			//HOW DO I DOUBLE CROSSSSS
				if ( turn != 179)
				{
					// if ( printt )
						// print("its dbl cross time: "+movestore);
					movestore.shift();
					var temp = movestore[0];
					movestore.shift();
					best_move = findvalidindex(temp[0],temp[1]);
					// if ( best_move == 10000 )
						// if ( printt )
							// print("NOT HAPPENING3: "+temp[0]+"-"+temp[1]);
					// else
						// if ( printt )
							// print("HAPPENING3: "+temp[0]+"-"+temp[1]);				
				}
			}
			else if ( movestore.length != 2 )
			{
				var temp = movestore[0];
				movestore.shift();
				best_move = findvalidindex(temp[0],temp[1]);
				// if ( best_move == 10000 )
					// if ( printt )
						// print("NOT HAPPENING2: "+temp[0]+"-"+temp[1]);
				// else
					// if ( printt )
						// print("HAPPENING2: "+temp[0]+"-"+temp[1]);
			}
			
		}
		
			
	}
	if( best_move == 10000 )
	{
		best_move = makesafe();
		if ( best_move == 10000 )
		{
			
			//print("-----------no safe space in the board----------");
			//TODO code for even odd long chains
			best_move = 0;
			var tt = chainlength();
			//print("element is "+tt[0]+" "+tt[1]+" on turn "+turn);
			if ( findvalidindex(tt[0],tt[1]) != 10000 )
				return board.valid_moves[findvalidindex(tt[0],tt[1])];
			else
				if ( printt )
					print("should not be here");
		}
	}	
	
    

    return board.valid_moves[best_move];
} 