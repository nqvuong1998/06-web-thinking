import React, { Component } from 'react'
import Cell from './Cell'
import '../../styles/Game/Row.css'

export class Row extends Component {
  
    render() {
        const { elements, row, mark, pieces_win } = this.props;
        const cells = elements.map((e, index) => (
          <Cell
            data={e}
            row={row}
            col={index}
            mark={(row, col) => mark(row, col)}
            pieces_win={pieces_win}
          />
        ));
        return cells;
    }
}

export default Row;