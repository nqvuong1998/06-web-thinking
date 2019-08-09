import {
    zeros, randomInt
  } from 'mathjs';

export default function generateMatrix(rows, cols, bombs){

    if(bombs > rows*cols){
        alert('Bombs must be less than or equal to '+(rows*cols));
        return [];
    }

    let matrix = getZerosMatrix(rows, cols);
    
    let countBombs = 0;
    while(countBombs < bombs){
        let bomb_x = getRandomBomb_XY(rows);
        let bomb_y = getRandomBomb_XY(cols);
        if(matrix[bomb_x][bomb_y]<0){
            continue;
        }
        countBombs++;
        for(let x = -1; x <= 1 ; x++){
            for(let y = -1; y <= 1 ; y++){
                if(x === 0 && y === 0){
                    matrix[bomb_x][bomb_y] = -bombs;
                }
                else{
                    if(bomb_x + x >= 0 && bomb_x + x < rows && bomb_y + y >=0 && bomb_y + y < cols){
                        matrix[bomb_x + x][bomb_y + y]+=1;
                    }
                }
            }
        }
    }
    return matrix;
}

function getRandomBomb_XY(value){
    return randomInt(0, value); 
}

function getZerosMatrix(rows, cols){
    return zeros([parseInt(rows),parseInt(cols)]);
}



