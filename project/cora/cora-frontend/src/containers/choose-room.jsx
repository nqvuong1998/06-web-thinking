import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Modal} from 'antd';
import {withRouter} from 'react-router-dom';
import {chooseRoom, updateUserO} from '../actions/index';
import {bindActionCreators} from 'redux';
import {message} from 'antd'

class ChooseRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: "",
      betMoney: 0,
      host: ""
    }
  }

  showModal = () => {
    this.setState({visible: true});
  };

  handleOk = e => {
      this.setState({visible: false});

      if (this.props.user.money < this.state.betMoney) {
        message.error("Your money is not enough!");
      } else {

        this
          .props
          .updateUserOFunc(this.props.user)

        let roomObject = {
          id: this.state.id,
          title: this.props.chooseRoom.title,
          created_at: this.props.chooseRoom.created_at,
          bet_money: this.state.betMoney,
          host_name: this.props.chooseRoom.host_name,
          host: this.props.chooseRoom.host
        }

        console.log(roomObject);

        let request = {
          game_id: this.state.id,
          user_id: this.props.user.id,
          username: this.props.user.username,
          socket_id: this.props.user.idsocket
        }

        this.props.user.socket.emit('join-game-from-client',request);
        this.props.user.socket.on('join-game-from-server',(msg)=>{
          console.log("join gamee");
          console.log(msg);
          console.log(this.state.game_id);
          if (msg.status==="full")
          {
            message.error(msg.status);
          }else if (msg.status==="ok"){
            let room = {
              id: msg.game_id,
              bet_money: msg.bet_money,
              host: msg.host,
              host_name: msg.host_name
              
            }
            this.props.chooseRoomFunc(room);
            message.success("Join room");
            this
              .props
              .history
              .push('/play');
          }else{
            message.error(msg.status)
          }
        })
      }
  };

  handleCancel = e => {
    console.log(e);
    this.setState({visible: false});
    this
      .props
      .chooseRoomFunc(null);

  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.chooseRoom) {
      this.setState({visible: true, id: nextProps.chooseRoom.id, betMoney: nextProps.chooseRoom.bet_money, host: nextProps.chooseRoom.host_name});
    }
  }

  render() {

    return (
      <div>
        <Modal
          title="Join room"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
          <div className="text-ask">Do you accept bet money ${this.state.betMoney} from {this.state.host}?
          </div>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {chooseRoom: state.chooseRoom, user: state.user};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    chooseRoomFunc: chooseRoom,
    updateUserOFunc: updateUserO
  }, dispatch);
}

let ChooseRoomContainer = connect(mapStateToProps, mapDispatchToProps)(ChooseRoom);
export default withRouter(ChooseRoomContainer);
