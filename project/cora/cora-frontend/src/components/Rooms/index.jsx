import React from 'react'
import RoomContainer from '../../containers/roomlist'
import NavBar from '../NavBar'
import Footer from '../Footer'
import {Button} from 'reactstrap'
import '../../styles/Room/room.css'
import ChooseRoomContainer from '../../containers/choose-room'
import {Slider, Modal, Button as ButtonA} from 'antd'
import {withRouter} from 'react-router-dom';
import {message} from 'antd'
import {connect} from 'react-redux' 
import {bindActionCreators} from 'redux'
import * as gameActions from '../../actions';

const marks = {
  0: '$0',
  
  1000: {
    label: <strong>$1000</strong>,
  },
};

class Room extends React.Component{   

  state = { 
    visible: false,
    money: 0,
    waiting: false,
    confirmLoading:false,
    game_id:"",
    gameModeVisible:false
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  showGameMode = () => {
    this.setState({
      gameModeVisible: true,
    });
  };

  componentWillMount(){
    this.props.actions.updateUser(JSON.parse(localStorage.getItem("userInfo")));
  }

  handleOk = e => {
    
    this.setState({ 
      visible: false,
    });
    
    if (this.props.user.money < this.state.money){
      message.error("Your money is not enough!");  
    }
    else{
      this.setState({
        waiting:true
      })
    
    }
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCloseGameMode = e =>{
    this.setState({
      gameModeVisible: false,
    });
  }

  handleWaitingOk = e =>{
    
    // let roomObject = {
    //   id:uuid.v4(),
    //   name: this.props.user.username+"'s room",
    //   createdAt:(new Date()).toLocaleString(),
    //   betMoney: this.state.money,
    //   host: this.props.user.username
    // }
    // console.log(roomObject);

    //socket = socketIOClient(SOCKET_SERVER);
    let roomCreate = {
      user_id: this.props.user.id,
      bet_money: this.state.money,
      username: this.props.user.username,
      socket_id: this.props.user.idsocket
    }
    this.setState({confirmLoading:true});
    //console.log(roomCreate);
    this.props.user.socket.emit('create-game-from-client', roomCreate);    

    this.props.user.socket.on('create-game-from-server',(data) =>{
          // console.log(data);
          // let user = Object.assign({}, this.props.user);
          // user.token = data.token;
          // this.props.actions.updateUser(user);
          
          // let userLocal = Object.assign({}, this.props.user);
          // userLocal.token = data.token;
          // userLocal.socket=null;
          // userLocal.idsocket="";
          // localStorage.setItem('userInfo', JSON.stringify(userLocal));
          this.setState({game_id:data.game_id})
    });

    this.props.user.socket.on('join-game-from-server',(msg)=>{
          console.log("so join game");
          console.log(msg);
      if (msg.status==="full")
          {
            message.error(msg.status);
          }else if (msg.status==="ok"){
            this.setState({
              confirmLoading: false,
              waiting:false
            });

            let userO = {
                  id: msg.opponent,
                  username:msg.opponent_name
            }
            let room = {
              id: msg.game_id,
              bet_money: msg.bet_money,
              host: msg.host,
              host_name: msg.host_name
              
            } 
            this.props.actions.updateUserO(userO);
            this.props.actions.chooseRoom(room);
            message.success("Join room");
            this
              .props
              .history
              .push('/play');
          }else{
            message.error(msg.status)
          }
    })

    this.props.user.socket.on('fail-create-room-server',(err)=>{
      this.setState({
        confirmLoading: false,
        waiting:false
      });
      message.error(err.status);
    });

    // let roomlist = JSON.parse(JSON.stringify(this.props.rooms));
    // roomlist.unshift(roomObject)
    // this.props.actions.updateRooms(roomlist);

    // this.setState({
    //   confirmLoading: true
    // });

    // setTimeout(() => {
    //   this.setState({
    //     waiting: false,
    //     confirmLoading: false,
    //   });

    
    //   message.success("Join room");
    //   this.props.history.push('/play');
    // }, 5000);

  }

  playBot = () =>{
    let userO = {
        id: "bot",
        username: "bot"
    }
    let room = {
      id: "playvsbot",
      bet_money: 0,
      host: this.props.user.id,
      host_name: this.props.user.username
      
    }
    this.props.actions.switch_piece("X"); 
    this.props.actions.update_board_property({});
    this.props.actions.updateUserO(userO);
    this.props.actions.chooseRoom(room);

    console.log(this.props.userO);

    message.success("Join room");
    this.props.history.push('/play');
  }

  handleWaitingCancel = e =>{
    
    this.setState({
      waiting: false,
      confirmLoading: false
    });

    let message = {
      game_id: this.state.game_id,
      socket_id: this.props.user.idsocket  
    }  
    this.props.user.socket.emit('remove-game-from-client',message); 
    
    this.props.user.socket.on('fail-remove-game-from-client',(err)=>{
      message.error(err);
    });
  }
  
  onAfterChangeSlider(value) {
    console.log('onAfterChange: ', value);
  }

  onChange(value) {
    console.log('changed', value);
    this.setState({money: value})
  }

  render(){
    //console.log(this.props.user);
    const { money } = this.state;
    return(
      <div>
        <NavBar/>
        <div className="container container-room">
          < RoomContainer/>
          <ChooseRoomContainer/>
        </div>
        
        <div className="container">
        <div className="row">
        <Button color="primary" className="btn-create-room" onClick={this.showGameMode}>
          +
        </Button>
        </div>
        </div>

        <Modal
          title="Game mode"
          visible={this.state.gameModeVisible}
          footer={[
            <ButtonA onClick={this.handleCloseGameMode}>
              Back
            </ButtonA>
          ]}
          >
          <div className="d-flex flex-row justify-content-around">
            <Button color="primary" onClick={this.playBot}>Player vs Bot</Button>
            <Button color="primary" onClick={this.showModal}>Player vs Player</Button>
          </div>
        </Modal>

        <Modal
          visible={this.state.visible}
          title="Choose bet money" 
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          
        >
          <div className="money">$ {money}</div>

          <Slider marks={marks} defaultValue={0} min={0}
            max={1000} step={10}
            onAfterChange={this.onAfterChangeSlider} onChange={this.onChange.bind(this)} />
        </Modal>

        <Modal
          title="Are you ready?"
          visible={this.state.waiting}
          onOk={this.handleWaitingOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleWaitingCancel}
        >
          <p className="text-ask">Click OK to wait for other join your room...</p>
        </Modal>
    
        <Footer/>
      </div>
    )
  };

}

function mapsStateToProps(state){
  return {
    user:state.user,
    userO: state.userOCurrent.User0,
    chooseRoom: state.chooseRoom,
    rooms: state.rooms,
    roomPlaying: state.roomPlaying
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
};

export default withRouter(connect(mapsStateToProps,mapDispatchToProps)(Room));