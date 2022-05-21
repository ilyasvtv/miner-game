import { useState, useEffect } from "react"
import './Board.sass'
import Cell from "../Cell/Cell";

export default function Board({refreshStatus, changeRefreshStatus, quantityOfCells, changeBombsInfo, changeEndGameStatus, endGame}) {
    //tech constants
    const CELL_WITH_BOMB_ID = 101;
    const CELL_WITHOUT_BOMB_ID = 111;
    const GUESS_CELL_ID = 222;

    //game-board state
    const [boardState, setBoard] = useState([
        [[0, '']]
    ]);

    //remaining quantity of bombs to find
    const [quantityOfMines, setQuantityOfMines] = useState(0);
    //total quantity of mines on the field
    const [totalQuantityOfMines, setTotalQuantityOfMines] = useState(0);
    //total quantity of flags on the field
    const [totalQuantityOfFlags, setTotalQuantityOfFlags] = useState(0);

    //Start a new game, when a player press "new game button"
    useEffect(() => {
        if (refreshStatus) {
            changeRefreshStatus();
            setTotalQuantityOfFlags(0);
            const heigth = quantityOfCells.heigth;
            const width = quantityOfCells.width;
            //count max possible quantity of mines
            let maxMines = Math.floor(heigth * width * 0.5);
            let totalMines = 0;
            const newBoard = Array.from(Array(heigth), () => new Array(width));
            for (let i = 0; i < heigth; i++) {
                for (let g = 0; g < width; g++) {
                    let mineCell = 0;
                    if (maxMines > 0) {
                        //if a random number 1 or 2 or 3 or 4 or 5 => the cell witout a mine, if a random number is 0 => the cell with a mine
                        mineCell = Math.floor(Math.random() * 5);
                        mineCell = mineCell > 0 ? 0 : 1;
                        if (mineCell === 1) {
                            maxMines--;
                            totalMines++;
                        };
                    }
                    newBoard[i][g] = [mineCell, ''];
                }
            }
            setBoard(newBoard);
            setQuantityOfMines(totalMines);
            setTotalQuantityOfMines(totalMines);
        }
    }, [refreshStatus])

    //click on a cell
    function clickOnCells(e, id) {
        if (endGame) return;
        const board = [...boardState];
        //remove context menu on right click
        e.preventDefault();
        let i = id[0];
        let g = id[1];
        //right button click
        if (e.button === 2) {
            //allow to click only on cells with empty or flag status
            if (board[i][g][1] === '' || board[i][g][1] === GUESS_CELL_ID) {
                const oldValue = board[i][g][1];
                //if a flag placed on a mine => decrease quantity of remaining mines that a player have to find  (and increase, if a player remove a flag from the cell)
                if (board[i][g][1] !== GUESS_CELL_ID && board[i][g][0] === 1) {
                    setQuantityOfMines(prev => prev - 1);
                } else if (board[i][g][1] === GUESS_CELL_ID && board[i][g][0] === 1) {
                    setQuantityOfMines(prev => prev + 1);
                }
                //increase or decrase quantity of placed flags
                if (oldValue === GUESS_CELL_ID) {
                    setTotalQuantityOfFlags(prev => prev - 1);
                } else {
                    setTotalQuantityOfFlags(prev => prev + 1);
                }
                board[i][g][1] = oldValue === GUESS_CELL_ID ? '' : GUESS_CELL_ID;
                setBoard(board);
                return;
            }
        }
        //return, if the cell is already open
        if (board[i][g][1] !== '') return;
        //game over, as a player opened a cell with a mine
        if (board[i][g][0] === 1) {
            for(let i = 0; i < board.length; i++) {
                for (let g = 0; g < board[i].length; g++) {
                    if (board[i][g][0] === 1) {
                        board[i][g][1] = CELL_WITH_BOMB_ID;
                    }
                }
            }
            setBoard(board);
            //refresh bool status that shows the end of game
            changeEndGameStatus();
            return;
        }
        //find all mines in all directions until first cells with numbers
        findEmptyCell(board, i, g);
        setBoard(board);
    }

    //change information in menu with actual values
    useEffect(() => {
        changeBombsInfo(totalQuantityOfMines, totalQuantityOfFlags)
    }, [totalQuantityOfFlags, totalQuantityOfMines])
    
    //end of the game, if a player find all mines correctly
    useEffect(() => {
        if (totalQuantityOfMines !== 0 && quantityOfMines === 0 && totalQuantityOfFlags === totalQuantityOfMines) {
            setBoard(prev => {
                const newArr = Object.assign([], prev);
                for(let i = 0; i < boardState.length; i++) {
                    for (let g = 0; g < boardState[i].length; g++) {
                        if (newArr[i][g][0] === 1) {
                            newArr[i][g][1] = CELL_WITH_BOMB_ID;
                        }
                    }
                }
                return newArr;
            });
            changeEndGameStatus();
        };
    }, [quantityOfMines])

    //count mines function
    function countBombs(board, i, g) {
        let bombQuantity = 0;
        if (board[i] !== undefined && board[i][g - 1] !== undefined && board[i][g - 1][0] === 1) bombQuantity++;
        if (board[i] !== undefined && board[i][g + 1] !== undefined && board[i][g + 1][0] === 1) bombQuantity++;
        if (board[i + 1] !== undefined && board[i + 1][g] !== undefined && board[i + 1][g][0] === 1) bombQuantity++;
        if (board[i - 1] !== undefined && board[i - 1][g] !== undefined && board[i - 1][g][0] === 1) bombQuantity++;
        if (board[i - 1] !== undefined && board[i - 1][g - 1] !== undefined && board[i - 1][g - 1][0] === 1) bombQuantity++;
        if (board[i + 1] !== undefined && board[i + 1][g + 1] !== undefined && board[i + 1][g + 1][0] === 1) bombQuantity++;
        if (board[i + 1] !== undefined && board[i + 1][g - 1] !== undefined && board[i + 1][g - 1][0] === 1) bombQuantity++;
        if (board[i - 1] !== undefined && board[i - 1][g + 1] !== undefined && board[i - 1][g + 1][0] === 1) bombQuantity++;
        board[i][g][1] = bombQuantity === 0 ? CELL_WITHOUT_BOMB_ID : bombQuantity;
    }


    function findEmptyCell(board, i, g) {
        //return, if cell is not exist
        if (board[i] === undefined || board[i][g] === undefined || board[i][g][1] !== '') return;
        countBombs(board, i, g);
        //return, if cell has quantity of bombs around this cell
        if (board[i][g][1] !== '' && board[i][g][1] !== CELL_WITHOUT_BOMB_ID) return;
        //check different directions
        if (board[i - 1] !== undefined && board[i - 1][g] !== undefined && board[i - 1][g][1] === '') findEmptyCell(board, i - 1, g);
        if (board[i + 1] !== undefined && board[i + 1][g] !== undefined && board[i + 1][g][1] === '') findEmptyCell(board, i + 1, g);
        if (board[i] !== undefined && board[i][g + 1] !== undefined && board[i][g + 1][1] === '') findEmptyCell(board, i, g + 1);
        if (board[i] !== undefined && board[i][g - 1] !== undefined && board[i][g - 1][1] === '') findEmptyCell(board, i, g - 1);
        if (board[i - 1] !== undefined && board[i - 1][g + 1] !== undefined && board[i - 1][g + 1][1] === '') findEmptyCell(board, i - 1, g + 1);
        if (board[i + 1] !== undefined && board[i + 1][g - 1] !== undefined && board[i + 1][g - 1][1] === '') findEmptyCell(board, i + 1, g - 1);
        if (board[i + 1] !== undefined && board[i + 1][g + 1] !== undefined && board[i + 1][g + 1][1] === '') findEmptyCell(board, i + 1, g + 1);
        if (board[i - 1] !== undefined && board[i - 1][g - 1] !== undefined && board[i - 1][g - 1][1] === '') findEmptyCell(board, i - 1, g - 1);
    }

      
    return(
        <div className="board">
            {boardState.map((x, i) => {
                return <div className="row" key={i}>{
                    boardState[i].map((x, g) => {
                        return <Cell 
                        quantityOfBombs={boardState[i][g][1] !== '' && boardState[i][g][1] > 10 ? '' : boardState[i][g][1]}
                        colorOfCell={boardState[i][g][1]}
                        clickOnCells={clickOnCells}
                        endGame = {endGame}
                        refreshStatus = {refreshStatus}
                        id={[i, g]} 
                        key={g}/>
                    })
                }</div>
            })}
        </div>
    )
}
