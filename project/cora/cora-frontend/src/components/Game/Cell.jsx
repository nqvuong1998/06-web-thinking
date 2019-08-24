import React, { Component } from 'react'
import '../../styles/Game/Cell.css'
import {pieces} from '../../constants/actionTypes'
import {connect} from 'react-redux'

export class Cell extends Component {
    constructor() {
        super();
        this.state = {
          class_css_o: "not-focusable btn btn-default btnO btn-piece",
          class_css_x: "not-focusable btn btn-default btnX btn-piece",
          class_css_normal: "not-focusable btn btn-default btn-piece",
          isDisabled: 0
        };
      }
      render() {
        const { data, row, col, mark, pieces_win } = this.props;
        const { class_css_normal, class_css_o, class_css_x } = this.state;
        let my_class_css =
          data == pieces.O
            ? class_css_o
            : data == pieces.X
            ? class_css_x
            : class_css_normal;
        if (pieces_win != null) {
          for (var i = 0; i < pieces_win.length; i++) {
            if (pieces_win[i][0] == row && pieces_win[i][1] == col)
              my_class_css = my_class_css.concat(" btn-win");
          }
        }
        
        return (
          <button disabled={this.state.isDisabled}
            className={my_class_css}
            onClick={() => {
              if (data == null && 
                ((this.props.user.username === this.props.roomPlaying.host_name
                  && this.props.piece_current==="X")||
                  (this.props.user.username === this.props.userO.username
                    && this.props.piece_current==="O")))
                mark(row, col);
            }}
          >
            {data}
          </button>
        );
      }
}

const mapStateToProps = state =>{
  return {
    piece_current : state.gameReducer.piece_current,
    roomPlaying: state.roomPlaying,
    userO: state.userOCurrent.userO,
    user: state.user
  }
}

export default connect(mapStateToProps)(Cell)