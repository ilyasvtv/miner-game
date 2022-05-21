import { useState } from "react"
import './Menu.sass'

export default function Menu({setQuantityOfCells, bombsInfo}) {
    const [height, setHeight] = useState(20);
    const [width, setWidth] = useState(20);

    function heightHandler(e) {
        let newValue = +e.target.value;
        if (newValue < 1) newValue = 1;
        if (newValue > 30) newValue = 30;
        setHeight(newValue);
    }

    function widthHandler(e) {
        let newValue = +e.target.value;
        if (newValue < 1) newValue = 1;
        if (newValue > 30) newValue = 30;
        setWidth(newValue);
    }

    return (
        <div className="menu">
            <div className="title">Game Menu</div>
            <div className="total-flags">Total flags: {bombsInfo.flags}</div>
            <div className="total-bombs">Total bombs: {bombsInfo.bombs}</div>
            <div className="width-line">
                <div className="info">Height</div><input className="el-input" type = "number" onChange = {heightHandler} value = {height}/>
            </div>
            <div className="height-line">
                <div className="info">Width</div><input className="el-input" type = "number" onChange = {widthHandler} value = {width}/>
            </div>
            <button className="ng-btn" onClick = {() => setQuantityOfCells(height, width)}>Start new game</button>
        </div>
    )
}
  
