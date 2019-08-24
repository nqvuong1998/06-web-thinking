import React, {Component} from 'react'
import '../../../styles/Game/InforRoom.css'
import vs from '../../../resources/vs.png'
import {connect} from 'react-redux'

export class InfoRoom extends Component {
  state={
    money: this.props.roomPlaying ? this.props.roomPlaying.bet_money : 0,
    host: this.props.roomPlaying? this.props.roomPlaying.host_name:""
  }

  render() {
    
    return (
      <div className="info">
        <img src={vs} width="350px" height="460px" alt=""/>
        <div className="box-user-x">{this.state.host}</div>
        <div className="box-user-o">{this.props.userO.username}</div>
        <div className="box-bet-money">
          {(this.props.roomPlaying?this.props.roomPlaying.id==="playvsbot":true)?null:<div>${this.state.money}</div>}
          </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    user: state.users,
    chooseRoom:state.chooseRoom,
    userO: state.userOCurrent.userO,
    roomPlaying: state.roomPlaying
  };
}

export default connect(mapStateToProps)(InfoRoom);