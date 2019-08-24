const size = 16;

function uniq(items, key) {
    var set = {};
    return items.filter(function (item) {
        var k = key ? key.apply(item) : item;
        return k in set ? false : set[k] = true;
    });
}

function makeBoardCopy(board) {
    var copy_board = {};
    
    for (var x in board) {
        if (!board.hasOwnProperty(x)) {
            continue;
        }
        copy_board[x] = {};
        for (var y in board[x]) {
            copy_board[x][y] = board[x][y];
        }
    }
    return copy_board;
}

function findEmptyCells(board) {
    var copyBoard = makeBoardCopy(board);
    var emptyCells = [];

    for (var x = 0; x < size; x++) {
        
        if (!copyBoard.hasOwnProperty(x)) {
            for (var i = 0; i < size; i++) {
                emptyCells.push([x, i]);
            }
            
            continue;
        }

        
        var column = copyBoard[x];
        for (var y = 0; y < size; y++) {
            if (!column.hasOwnProperty(y)) {
                emptyCells.push([x, y]);
            }
        }
    }
    return emptyCells;
}

function findTypeCells(board, type) {
    var copyBoard = makeBoardCopy(board);
    var typeCells = [];

    for (var x = 0; x < size; x++) {
        if (!copyBoard.hasOwnProperty(x)) {
            
            continue;
        }
        
        var column = copyBoard[x];
        for (var y = 0; y < size; y++) {
            if (!column.hasOwnProperty(y)) {
                continue;
            }
            
            if (column[y] === type) {
                typeCells.push([x, y]);
            }
        }
    }
    return typeCells;
}

function findEmptyAdjacent(board, x, y) {
    var emptyCells = [];

    
    if (!board.hasOwnProperty(x)) {
        return [];
    }
    var column = board[x];
    if (!column.hasOwnProperty(y)) {
        return [];
    }
    var topLeft = [x - 1, y - 1];
    var topRight = [x + 1, y - 1];
    var bottomLeft = [x - 1, y + 1];
    var bottomRight = [x + 1, y + 1];
    var top = [x, y - 1];
    var bottom = [x, y + 1];
    var left = [x - 1, y];
    var right = [x + 1, y];
    
    if (x + 1 >= size) {
        topRight = [];
        right = [];
        bottomRight = [];
    }
    if (x - 1 < 0) {
        topLeft = [];
        left = [];
        bottomLeft = [];
    }
    if (y + 1 >= size) {
        bottomRight = [];
        bottom = [];
        bottomLeft = [];
    }
    if (y - 1 < 0) {
        topRight = [];
        top = [];
        topLeft = [];
    }
   
    if (board.hasOwnProperty(x - 1)) {
        if (board[x - 1].hasOwnProperty(y)) {
            left = [];
        }
        if (board[x - 1].hasOwnProperty(y + 1)) {
            bottomLeft = [];
        }
        if (board[x - 1].hasOwnProperty(y - 1)) {
            topLeft = [];
        }
    }
    if (board.hasOwnProperty(x + 1)) {
        if (board[x + 1].hasOwnProperty(y)) {
            right = [];
        }
        if (board[x + 1].hasOwnProperty(y + 1)) {
            bottomRight = [];
        }
        if (board[x + 1].hasOwnProperty(y - 1)) {
            topRight = [];
        }
    }
    if (board.hasOwnProperty(x)) {
        if (board[x].hasOwnProperty(y + 1)) {
            bottom = [];
        }
        if (board[x].hasOwnProperty(y - 1)) {
            top = [];
        }
    }
    
    if (topLeft.length !== 0) emptyCells.push(topLeft);
    if (topRight.length !== 0) emptyCells.push(topRight);
    if (bottomLeft.length !== 0) emptyCells.push(bottomLeft);
    if (bottomRight.length !== 0) emptyCells.push(bottomRight);
    if (top.length !== 0) emptyCells.push(top);
    if (bottom.length !== 0) emptyCells.push(bottom);
    if (left.length !== 0) emptyCells.push(left);
    if (right.length !== 0) emptyCells.push(right);
    return emptyCells;
}

function findIColChain(board, type, i, isFive) {

    var copyBoard = makeBoardCopy(board);

    var count = 0;
    
    for (var x = 0; x < size; x++) {
        
        if (!copyBoard.hasOwnProperty(x)) {
            continue;
        }
        var column = copyBoard[x];
        
        var spaceFront = false;
        var sfChainNum = 0;
        var sbChainNum = 0;
        for (var y = 0; y < size; y++) {
            
            if (!column.hasOwnProperty(y)) {
                if (sbChainNum === i) {
                    count++;
                }
                sbChainNum = 0;
                if (!spaceFront) {
                    spaceFront = true;
                }
                continue;
            }
            
            if (spaceFront) {
                if (column[y] === type) {
                    sfChainNum++;
                   
                    if (sfChainNum === i) {
                        count++;
                        spaceFront = false;
                        sfChainNum = 0;
                    }
                } else {
                    spaceFront = false;
                    sfChainNum = 0;
                }
            } else {
               
                if (column[y] === type) {
                    sbChainNum++;
                    if (isFive && sbChainNum === i) {
                        count++;
                        sbChainNum = 0;
                    }
                } else {
                    sbChainNum = 0;
                }
            }
        }
    }
    return count;
}

function findIRowChain(board, type, i, isFive) {
    var copyBoard = makeBoardCopy(board);
    var transposeBoard = {};

    var count;
    
    for (var x = 0; x < size; x++) {
        
        if (!copyBoard.hasOwnProperty(x)) {
            continue;
        }
        for (var y = 0; y < size; y++) {
            
            if (copyBoard[x].hasOwnProperty(y)) {
                if (!transposeBoard.hasOwnProperty(y)) {
                    transposeBoard[y] = {};
                }
                transposeBoard[y][x] = copyBoard[x][y];
            }
        }
    }
    count = findIColChain(transposeBoard, type, i, isFive);
    return count;
}

function findDIDiagChain(board, type, i) {
    
    var copyBoard = makeBoardCopy(board);

    
    var count = 0;
    
    var chainNums = [];
    
    var pointsToCheck = [];
    
    for (var x = 0; x < size; x++) {
        
        if (!copyBoard.hasOwnProperty(x)) {
            
            if (chainNums.length !== 0) {
                
                for (var j = 0; j < pointsToCheck.length; j++) {
                    delete chainNums[j];
                    delete pointsToCheck[j];
                }
            }
            continue;
        }
        var column = copyBoard[x];
        for (var y = 0; y < size; y++) {
            var pointFound = false;
            
            for (var k = 0; k < pointsToCheck.length; k++) {
                
                if (pointsToCheck[k] === undefined) {
                    continue;
                }
                var ptcX = pointsToCheck[k][0];
                var ptcY = pointsToCheck[k][1];
                if (x === ptcX && y === ptcY) {
                    pointFound = true;
                    
                    if (!column.hasOwnProperty(y)) {
                        delete chainNums[k];
                        delete pointsToCheck[k];
                        continue;
                    }
                    
                    else {
                        if (column[y] !== type) {
                            delete chainNums[k];
                            delete pointsToCheck[k];
                            continue;
                        }
                        chainNums[k]++;
                        if (chainNums[k] === i) {
                            count++;
                            delete chainNums[k];
                            delete pointsToCheck[k];
                        } else {
                            pointsToCheck[k] = [ptcX + 1, ptcY + 1];
                        }
                    }
                }
            }
            
            if (!pointFound) {
                
                if (!column.hasOwnProperty(y)) {
                    continue;
                }
                
                else {
                    if (column[y] === type) {
                        chainNums.push(1);
                        pointsToCheck.push([x + 1, y + 1]);
                    }
                }
            }
        }
    }
    return count;
}

function findUIDiagChain(board, type, i) {
    
    var copyBoard = makeBoardCopy(board);

    
    var count = 0;
    
    var flipBoard = {};
    for (var x = 0; x < size; x++) {
        
        if (!copyBoard.hasOwnProperty(x)) {
            continue;
        }
        for (var y = 0; y < size; y++) {
            
            if (copyBoard[x].hasOwnProperty(y)) {
                if (!flipBoard.hasOwnProperty(size - x - 1)) {
                    flipBoard[size - x - 1] = {};
                }
                flipBoard[size - x - 1][y] = copyBoard[x][y];
            }
        }
    }
    count = findDIDiagChain(flipBoard, type, i);
    return count;
}

function evaluateBoard(board, type) {
    var numZeros = findIColChain(board, type, 5, true) + findIRowChain(board, type, 5, true) + findDIDiagChain(board, type, 5) + findUIDiagChain(board, type, 5);
    var numOnes = findIColChain(board, type, 4, true) + findIRowChain(board, type, 4, true) + findDIDiagChain(board, type, 4) + findUIDiagChain(board, type, 4);
    var numTwos = findIColChain(board, type, 3, false) + findIRowChain(board, type, 3, false) + findDIDiagChain(board, type, 3) + findUIDiagChain(board, type, 3);
    var numThrees = findIColChain(board, type, 2, false) + findIRowChain(board, type, 2, false) + findDIDiagChain(board, type, 2) + findUIDiagChain(board, type, 2);
    var numFours = findIColChain(board, type, 1, false) + findIRowChain(board, type, 1, false) + findDIDiagChain(board, type, 1) + findUIDiagChain(board, type, 1);



    var score = numZeros * 1000000 + numOnes * 300000 + numTwos * 1000 + numThrees * 100 + numFours * 10;
    return score;
}

export default function minimax(board, depth, alpha, beta, type) {

    let t_type;
    if(type === "X"){
        t_type="O";
    }
    else{
        t_type="X";
    }

    var playerPieces = findTypeCells(board, type);
    playerPieces = playerPieces.concat(findTypeCells(board, t_type));
    var numPieces = playerPieces.length;
    var moves = [];
    if (playerPieces.length !== 0) {
        for (var i = 0; i < numPieces; i++) {
            
            var x = playerPieces[i][0];
            var y = playerPieces[i][1];
            
            moves = moves.concat(findEmptyAdjacent(board, x, y));
        }
    }
    
    if (moves.length === 0) {
        moves = findEmptyCells(board);
    }
    
    moves = uniq(moves, [].join);
    

    var bestMove = moves[0];
    var result = [alpha, bestMove];
    
    
    if (depth === 0) {
        result = [(evaluateBoard(board, type) - evaluateBoard(board, t_type)), moves.pop()];
        return result;
    }
    
    
    var currentAlpha = alpha;
    while (moves.length > 0) {
        var freshBoard = makeBoardCopy(board);
        var testMove = moves.pop();
        
        
        var testX = testMove[0];
        var testY = testMove[1];

        
        if (freshBoard[testX] === undefined) {
            freshBoard[testX] = {};
        }
        freshBoard[testX][testY] = type;
        
        var temp = minimax(freshBoard, depth - 1, -beta, -currentAlpha, t_type);
        var tempScore = -temp[0];

        
        if (tempScore > currentAlpha) {
            currentAlpha = tempScore;
            bestMove = testMove;
        }
        
        if (currentAlpha > beta) {
            result = [currentAlpha, bestMove];
            return result;
        }
    }
    result = [currentAlpha, bestMove];
    return result;
}