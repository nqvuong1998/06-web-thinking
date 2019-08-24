import React, {Component} from 'react'
import Row from './Row';
import '../../styles/Game/Board.css'

export class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numbercell: null
    }
  }
  render() {
    const {
      set_number_cell,
      array_board,
      mark,
      piece_current,
      is_win,
      pieces_win,
      reset_board
    } = this.props;
    return (
      <div>
          <div className="board">
                {array_board.map((e, index) => (
                    <div>
                      <Row
                        elements={e}
                        mark={(row, col) => mark(row, col)}
                        row={index}
                        pieces_win={pieces_win}/>
                    </div>
                  ))}
            </div>

       </div>   
    )
  }
}
export default Board