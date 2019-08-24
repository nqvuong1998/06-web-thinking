import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import Board from "../Game/Board";
import * as gameActions from "../../actions";
import {pieces} from "../../constants/actionTypes";
import {checkWin} from "../../algorithms/checkwin";
import NavBar from "../NavBar";
import InfoRoom from "./InfoRoom";
import Timer from "./Timer";
import Footer from '../Footer';
import "../../styles/Game/Game.css"
import ChatBox from "./ChatBox";
import GameResultModal from "./GameResultModal";
import minimax from '../../algorithms/minimax';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      isWin: -1,
      piecesWin: null
    }
  }

  addPiecesToBoardProperty = (board,row,col,piece) =>{
    if (board.hasOwnProperty(row)){
      board[row][col] = piece;
    }else{
      board[row] = {};
      board[row][col] = piece;
    }
    return board;
  }

  makeBoardCopy(board) {
    var copy_board = {};
    
    for (var x in board) {
        if (!board.hasOwnProperty(x)) {
            continue;
        }
        copy_board[x] = {};
        for (var y in board[x]) {
            copy_board[x][y] = board[x][y];
        }
    }
    return copy_board;
}

  componentWillMount = ()=>{
    console.log("GAME");
    console.log(this.props.chooseRoom);
    let room = JSON.parse(JSON.stringify(this.props.chooseRoom))
    this.props.actions.roomPlaying(room)
  }

  componentWillReceiveProps = props =>{
    if (this.props.roomPlaying && this.props.roomPlaying.id !=="playvsbot"){
      if (props.countdown===0){
               
        let request = {
          socket_id: this.props.user.idsocket,
          game_id: this.props.roomPlaying.id,
          user_id: this.props.user.id
        }
        this.props.user.socket.emit('ignore-game-from-client',request);
    }
    if (this.props.user.socket)
    this.props.user.socket.on('ignore-game-from-server',(data)=>{
     
      let dataJSON = JSON.parse(data);
      if (dataJSON.status === "ignore game"){
        this.setState({isWin:1}) 
        this.props.actions.switch_piece(dataJSON.info.turn);  
        this.props.actions.updateIgnoreTurn(true);
      }
    })
    }
  }

  componentDidMount = () =>{
    if (this.props.user.socket)
    this.props.user.socket.on('play-game-from-server',(data)=>{
      console.log("gamefromserver");
      
      let dataJSON = JSON.parse(data);
      console.log(dataJSON);

      const {actions, array_board, number_cell} = this.props;

      let count_tmp = this.state.count + 1;
      this.setState({count: count_tmp});

      let array_new = array_board;
      array_new[dataJSON.x][dataJSON.y] = dataJSON.info.turn === "X" ? "O":"X";
      actions.mark(array_new);
   
      //check win
      const pieces_win = dataJSON.result;

      if (pieces_win && pieces_win.length > 0) {
        console.log("win");
        this.setState({isWin: 1, piecesWin: pieces_win});

      } else if (count_tmp === number_cell * number_cell) {
        this.setState({isWin: 0})
      } else {
        actions.switch_piece(dataJSON.info.turn); 
      }
    })
  }

  mark(row, col) {
    console.log(this.props.user);
    
    if (this.props.roomPlaying.id !== "playvsbot"){
      let request = {
        x:row,
        y:col,
        socket_id: this.props.user.idsocket,
        game_id: this.props.roomPlaying.id,
        user_id: this.props.user.id
      }
      console.log(request);
      this.props.user.socket.emit('play-game-from-client',request);  
    }

    const {actions, array_board, piece_current, number_cell} = this.props;
    if (this.state.isWin === 1) {
      return;
    }

    let count_tmp = this.state.count + 1;
    this.setState({count: count_tmp});

    let array_new = array_board;
    array_new[row][col] = piece_current;

    actions.mark(array_new);

    //check win
    const pieces_win = checkWin(array_new, row, col, piece_current);

    if (pieces_win.length > 0) {
      console.log("win");
      this.setState({isWin: 1, piecesWin: pieces_win});

    } else if (count_tmp === number_cell * number_cell) {
      this.setState({isWin: 0})
    } else {
      
      if (this.props.roomPlaying.id==="playvsbot"){
        
        let board_property = this.makeBoardCopy(this.props.board_property);
        board_property= this.addPiecesToBoardProperty(board_property,col,row,"X")
        console.log(board_property);
       
        if (this.props.piece_current==="X"){
             actions.switch_piece("O");
             var bestMove = minimax(board_property, 2, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, "X");
             console.log(bestMove[1][0]);
             console.log(bestMove[1][1]); 
          
             let newRow = bestMove[1][0];
             let newCol = bestMove[1][1];

            board_property = this.addPiecesToBoardProperty(board_property,newRow,newCol,"O");
            this.props.actions.update_board_property(board_property);

             let array_new = this.props.array_board;
             array_new[newCol][newRow] = "O";
             actions.mark(array_new);
             //check win
             const pieces_win = checkWin(array_new, newCol, newRow,"O");
            
          if (pieces_win.length > 0) {
            console.log("win");
            this.setState({isWin: 1, piecesWin: pieces_win});

          } else if (count_tmp === number_cell * number_cell) {
            this.setState({isWin: 0}) 
            
          }else
            actions.switch_piece("X");
      }
    }
    else
        actions.switch_piece(piece_current === pieces.X
        ? pieces.O
        : pieces.X); 
    }
  }

  reset_board() {
    this
      .props
      .actions
      .init_array(Array(16).fill(null).map(() => Array(16).fill(null)));
    this
      .props
      .actions
      .switch_piece(pieces.X);
    this.setState({count: 0, isWin: -1, piecesWin: null});
  }

  render() {
    
    const {actions, array_board, piece_current} = this.props;
    //console.log(array_board);
    const {isWin, piecesWin} = this.state;
    return (
    <div>
    <NavBar/>
    <GameResultModal piece_current={piece_current} is_win={isWin} time={this.props.countdown}/>
    <Timer piece_current={piece_current} is_win={isWin}/>
        <div className="container container-info-board-message">
          <div className="row">
            <div className="col">
                <InfoRoom />
            </div>
            <div className="col-xl-5 col-lg-6 col-md-12 col-sm-12 col-board">
                <div className="container-board">
                    <Board
                        set_number_cell={ numberCell => { 
                          const number_cell = parseInt(numberCell); 
                          actions.set_number_cell(number_cell); 
                          actions.init_array(
                              Array(number_cell).fill(null).map(() => Array(number_cell).fill(null))
                            ); 
                          } 
                        }
                        
                        array_board={array_board}
                        
                        mark={(row,col) => this.mark(row, col)}
                        
                        piece_current={piece_current}
                        
                        is_win={isWin}
                        
                        pieces_win={piecesWin}
                        
                        reset_board={() => this.reset_board()}
                    />
              </div>

            </div>
            <div className="col">
                  <ChatBox/>
            </div>
          </div>
        </div>
    <Footer/>
    </div>
  );
  }
}

const mapStateToProps = state => (
  {
    number_cell: state.gameReducer.number_cell, 
    array_board: state.gameReducer.array_board, 
    piece_current: state.gameReducer.piece_current,
    user: state.user,
    chooseRoom:state.chooseRoom,
    countdown:state.countdown,
    roomPlaying:state.roomPlaying,
    board_property: state.gameReducer.board_property
  }
);

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);