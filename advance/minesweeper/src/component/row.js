import React, { Component } from 'react'
import Cell from './cell';
import '../css/row.css'

export class Row extends Component{

    initCells(){
        let rows = this.props.rows;
        let cells = [];
        rows.forEach((element, i) => {
            cells.push(<Cell key={i} content={element}/>)
        });
        return cells;
    }

    render(){
        return (
            <div className="row">
                {this.initCells()}
            </div>
        )
    }
}

export default Row;