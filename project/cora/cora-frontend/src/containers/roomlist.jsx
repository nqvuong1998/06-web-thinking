import React, {Component} from 'react'
import {connect} from 'react-redux'
import Pagination from '../components/Rooms/pagination'
import '../styles/Room/room.css'
import {bindActionCreators} from 'redux';
import socketIOClient from "socket.io-client";
import * as gameActions from "../actions/index";
import {SOCKET_SERVER} from '../constants/variable';

import axios from 'axios';
import {API_SERVER} from '../constants/variable'


class RoomList extends Component {

  state = {
    allRooms: [],
    currentRooms: [],
    currentPage: null,
    totalPages: null,
    endpoint: SOCKET_SERVER
  };

  componentWillMount(){
    console.log(this.props.user);
    const socket = socketIOClient(this.state.endpoint,{query: {"token": this.props.user.token, "user_id":this.props.user.id}});
    socket.on('socket-id-from-server', (data) => {
     console.log(data);
     let userSocket = Object.assign({}, this.props.user);
     userSocket.idsocket = data.socket_id;
     userSocket.socket = socket;
     this.props.actions.updateUser(userSocket);
    })

   
    socket.on('load-game-from-server', (data) => {
      //console.log((JSON.parse(data).list).map(item => JSON.parse(item)));
      let dataCraw = (JSON.parse(data).list).map(item => JSON.parse(item));
      //let oldData = this.props.rooms;
      
      const curPage = this.state.currentPage?this.state.currentPage:1;
      this.setState({
        allRooms:dataCraw,
        currentRooms: (dataCraw?dataCraw.slice((curPage-1)*8, curPage*8):null),
        currentPage: curPage,
        totalPages:dataCraw?dataCraw.length:0
       });
      //socket.removeListener('load-game-from-server');
    })
  }

  componentDidMount(){
    axios.get(API_SERVER+"/users/"+this.props.user.id, {
      headers: {
        token: this.props.user.token
      }
    })
    .then((msg) =>{
        console.log(msg);
        let user = Object.assign({}, this.props.user);
        user.token = msg.data.token;
        user.money = parseInt(msg.data.total_money);
        this.props.actions.updateUser(user);

        let userLocal = JSON.parse(localStorage.getItem("userInfo"));
        userLocal.token = msg.data.token;
        userLocal.money = msg.data.total_money;
        localStorage.setItem('userInfo', JSON.stringify(userLocal));

    })
      .catch((err)=>{
        console.log(err);
    })
  }

  onPageChanged = data => {
    const { allRooms } = this.state;
    const { currentPage, totalPages, pageLimit } = data;

    const offset = (currentPage - 1) * pageLimit;
    const currentRooms = allRooms.slice(offset, offset + pageLimit);

    this.setState({ currentRooms, currentPage, totalPages});
  };


  createRoomListItems(currentItems) {
    
    let listItems = 
      currentItems
      .map((eachRoom) => {
        return (
          <div key={eachRoom.id} className="col-lg-6 col-md-12 col-room">
            <div className="card-room" 
            onClick={() => {this.props.actions.chooseRoom(eachRoom)}}>
              <div>
                <div className="room-name">
                  {eachRoom.title}
                </div>
                <div className="room-created-at">
                  {eachRoom.created_at}
                </div>
              </div>
              <div className="room-bet-money">
                ${eachRoom.bet_money}
              </div>
            </div>
          </div>
        );
      })
    return listItems;
  }

  render() {
    const {
      allRooms,
      currentRooms
    } = this.state;
    const totalRooms = allRooms.length;
   
    if (totalRooms === 0) 
    return (
      <div>
        <h2 className="title-room-list">Total rooms: {totalRooms}</h2>
      </div>);
   
    return (
      <div>
        <h2 className="title-room-list">Total rooms: {totalRooms}</h2>

      <div className="row">
        {this.createRoomListItems(currentRooms)}
      </div>
       <div className="d-flex flex-row py-4 align-items-center justify-content-center">
       <Pagination
         totalRecords={totalRooms}
         pageLimit={8}
         pageNeighbours={1}
         onPageChanged={this.onPageChanged}
       />
     </div>
     
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rooms: state.rooms,
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  }
}

let RoomContainer = connect(mapStateToProps,mapDispatchToProps)(RoomList);
export default RoomContainer;