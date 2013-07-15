function random_element(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)];
}

function move(board) {
  return random_element(board.valid_moves);
}