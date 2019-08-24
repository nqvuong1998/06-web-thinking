export const checkWin = (board, row, col, turn) => {
  console.log("checkwin");
  let piece_win = [];
  // check col win
  let index = col - 1;

  while (index >= 0 && board[row][index] == turn) {
    piece_win.push([row, index]);
    index--;
  }

  index = col + 1;
  while (index <= board.length - 1 && board[row][index] == turn) {
    piece_win.push([row, index]);
    index++;
  }

  if (piece_win.length >= 4) {
    piece_win.push([row, col]);
    return piece_win;
  }

  // check row
  index = row - 1;
  piece_win = [];
  while (index >= 0 && board[index][col] == turn) {
    piece_win.push([index, col]);
    index--;
  }

  index = row + 1;
  while (index >= 0 && index < board.length - 1 && board[index][col] == turn) {
    piece_win.push([index, col]);
    index++;
  }

  console.log(piece_win)

  if (piece_win.length >= 4) {
    piece_win.push([row, col]);
    return piece_win;
  }

  // check diagonal left
  let row_index = row - 1;
  let col_index = col - 1;
  piece_win = [];

  while (
    row_index >= 0 &&
    col_index >= 0 &&
    board[row_index][col_index] == turn
  ) {
    piece_win.push([row_index, col_index]);
    row_index--;
    col_index--;
  }

  row_index = row + 1;
  col_index = col + 1;
  while (
    row_index >= 0 &&
    col_index >= 0 &&
    row_index <= board.length - 1 &&
    col_index <= board.length - 1 &&
    board[row_index][col_index] == turn
  ) {
    piece_win.push([row_index, col_index]);
    row_index++;
    col_index++;
  }

  if (piece_win.length >= 4) {
    piece_win.push([row, col]);
    return piece_win;
  }
  // check diagonal left
  row_index = row - 1;
  col_index = col + 1;
  piece_win = [];
  while (
    col_index >= 0 &&
    row_index >=0 &&
    col_index <= board.length - 1 &&
    board[row_index][col_index] == turn
  ) {
    piece_win.push([row_index, col_index]);
    row_index--;
    col_index++;
  }
  row_index = row + 1;
  col_index = col - 1;
  while (
    row_index >= 0 &&
    row_index <= board.length - 1 &&
    col_index >= 0 &&
    board[row_index][col_index] == turn
  ) {
    piece_win.push([row_index, col_index]);
    row_index++;
    col_index--;
  }

  if (piece_win.length >= 4) {
    piece_win.push([row, col]);
    return piece_win;
  }
  return [];
};