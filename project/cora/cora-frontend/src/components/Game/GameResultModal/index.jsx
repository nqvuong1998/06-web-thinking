import React from 'react'
import {Modal, Button} from 'antd';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux'
import * as gameActions from "../../../actions";
import {bindActionCreators} from "redux";
import '../../../styles/Game/Game.css';


class GameResultModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      class_css_lose: "basicNotice basic-lose",
      class_css_win: "basicNotice basic-win",
      class_css_draw: "basicNotice basic-draw"
    }
  }

  showModal = () => {
    this.setState({visible: true});
  };

  handleCancle = e =>{
    this.setState({visible:false})
  }

  handleOk = e => {
    console.log(e);
    this.setState({visible: false});
    this.props.actions.updateIgnoreTurn(false);

    this
      .props
      .actions
      .init_array(Array(16).fill(null).map(() => Array(16).fill(null)));

    this
      .props
      .history
      .push('/rooms');
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.is_win === 1 || nextProps.is_win === 0 || nextProps.ignoreTurn === true) {
      this.setState({visible: true});
    }
  }

  render() {
    const {piece_current, is_win, roomPlaying, user, userO, ignoreTurn} = this.props;
    let content="";
    let mycss = "";
    if (!ignoreTurn && is_win===1){
      if ((user.username === roomPlaying.host_name && piece_current==="X")
        ||(user.username === userO.username && piece_current==="O")){
        content="YOU WIN"
        mycss = this.state.class_css_win
      }else{
        content="YOU LOSE"
        mycss = this.state.class_css_lose
      }
    }else if (is_win===0){
        content="YOU DRAW"
        mycss = this.state.class_css_draw
    }

    if (ignoreTurn){
      if ((user.username === userO.username && piece_current==="X")
        ||(user.username === roomPlaying.host_name && piece_current==="O")){
        content="YOU WIN"
        mycss = this.state.class_css_win
      }else{
        content="YOU LOSE"
        mycss = this.state.class_css_lose
      }
    }

    return (
      <div>
        <Modal
          title="Result"
          visible={this.state.visible}
          footer={[
            <Button key="cancel" onClick={this.handleCancle}>
            Stay
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Quit
            </Button>
          ]}
          >
          <div className={mycss}>
            {content}
          </div>

          {content==="YOU WIN"?(
            <div className="animation">
            <div class="pyro">
            <div class="before"></div>
            <div class="after"></div>
            </div>
            </div>
          ):null}

        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state =>{
  return {
    roomPlaying: state.roomPlaying,
    user: state.user,
    userO: state.userOCurrent.userO,
    ignoreTurn: state.ignoreTurn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(GameResultModal));
