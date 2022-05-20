import { useEffect, useState } from "react";

export default function Cell({id, clickOnCells, quantityOfBombs, colorOfCell, endGame, refreshStatus}) {
    const numberColors = {
        1: '#b34612',
        2: '#8f8b0a',
        3: '#021105',
        4: '#0e5261',
        5: '#2435f8',
        6: '#a315ec',
        7: '#f824a3',
        8: '#f4002d',
    }

    const cellColors = {
        101: '#ff2300',
        111: '#ffb3fd9e',
        222: '#000'
    }

    //tech flag that shows that the cell has flag when the end game happens
    const [flagHere, setFlagHere] = useState(false);
    //text in a cell
    const [valueText, setValueText] = useState('');

    //set info with an information about mines
    useEffect(() => {
        setValueText(quantityOfBombs);
    }, [quantityOfBombs])

    //control of bool value of a flag
    useEffect(() => {
        if (colorOfCell === 222) {
            setFlagHere(true);
        }
        if (colorOfCell !== 222 && !endGame) {
            setFlagHere(false);
        }
    }, [colorOfCell])

    //when the end of game, show right predictions about mines
    useEffect(() => {
        if (endGame && flagHere && colorOfCell === 101) {
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
        style = {{background: cellColors[colorOfCell], color: numberColors[quantityOfBombs]}}
        >{valueText}
        </div>
    )
}