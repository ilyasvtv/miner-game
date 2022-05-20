import Board from '../Board/Board'
import Menu from '../Menu/Menu'
import './App.sass'
import { useEffect, useState } from 'react'

export default function App() {
    const [quantityOfCells, setQuantity] = useState({
        width: 0,
        heigth: 0,
    })

    const [bombsInfo, setBombsInfo] = useState({
        bombs: 0,
        flags: 0
    })

    //bool value that shows the end of the game
    const [endGame, setEndGame] = useState(false);

    function changeEndGameStatus() {
        setEndGame(!endGame)
    }

    function changeBombsInfo(bombs, flags) {
        const newArr = {
            bombs: bombs,
            flags: flags
        }
        setBombsInfo(newArr);
    }

    //bool value that shows that a player start a new game
    const [refreshStatus, setRefreshStatus] = useState(false);

    function changeRefreshStatus() {
        setRefreshStatus(!refreshStatus);
    }

    function setQuantityOfCells(width, heigth) {
        changeRefreshStatus();
        setQuantity(prev => {
            const newArr = {...prev};
            newArr["width"] = width;
            newArr["heigth"] = heigth;
            return newArr;
        })
    }

    //refresh bool value "endGame" on a new game
    useEffect(() => {
        if (refreshStatus) setEndGame(false);
    }, [refreshStatus])

    return (
        <div className="App">
            <Board
            endGame = {endGame}
            changeEndGameStatus = {changeEndGameStatus}
            changeBombsInfo = {changeBombsInfo}
            quantityOfCells = {quantityOfCells}
            refreshStatus = {refreshStatus}
            changeRefreshStatus = {changeRefreshStatus}
            />
            <Menu 
            bombsInfo = {bombsInfo}
            setQuantityOfCells = {setQuantityOfCells}
            />
        </div>
    )
}
