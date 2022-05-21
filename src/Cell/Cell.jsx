import { useEffect, useState } from "react";

export default function Cell({id, clickOnCells, quantityOfBombs, colorOfCell, endGame, refreshStatus}) {
    //tech constants
    const CELL_WITH_BOMB_ID = 111;
    const GUESS_CELL_ID = 222;

    const allColors = {
        0: '#ffb3fd9e',
        1: '#b34612',
        2: '#8f8b0a',
        3: '#021105',
        4: '#0e5261',
        5: '#2435f8',
        6: '#a315ec',
        7: '#f824a3',
        8: '#f4002d',
        111: '#ff2300',
        222: '#000'
    }

    //tech flag that shows that the cell has flag when the end game happens
    const [flagHere, setFlagHere] = useState(false);
    //text in the cell
    const [valueText, setValueText] = useState('');

    //set info with an information about mines
    useEffect(() => {
        setValueText(quantityOfBombs);
    }, [quantityOfBombs])

    //control of bool value of a flag
    useEffect(() => {
        if (colorOfCell === GUESS_CELL_ID) {
            setFlagHere(true);
        }
        if (colorOfCell !== GUESS_CELL_ID && !endGame) {
            setFlagHere(false);
        }
    }, [colorOfCell])

    //when the end of game, show right predictions about mines
    useEffect(() => {
        if (endGame && flagHere && colorOfCell === CELL_WITH_BOMB_ID) {
            setValueText('X');
        }
    }, [endGame])

    //refresh state with a text in a cell
    useEffect(() => {
        if (valueText !== '') setValueText('');
    }, [refreshStatus])

    return(
        <div 
        className = "cell" 
        onClick = {(e) => clickOnCells(e, id)}
        onContextMenu = {(e) => clickOnCells(e, id)}
        style = {{background: allColors[colorOfCell], color: allColors[quantityOfBombs]}}
        >{valueText}
        </div>
    )
}
