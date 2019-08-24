import React from 'react';
import ReactDOM from 'react-dom';
import "../../../styles/Game/ChatBox.css"
import Message from './Message.js';

import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import {connect} from "react-redux";


class ChatBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showEmojiPicker: false,
            chats: []
        };

        this.submitMessage = this.submitMessage.bind(this);
        this.addEmoji = this.addEmoji.bind(this);
        this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
    }

    componentWillMount = ()=>{
        if (this.props.user.socket)
        this.props.user.socket.on('chat-game-from-server',(data)=>{
            console.log(data.message);

            this.setState({
               chats: data.message
           })
        })
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    toggleEmojiPicker() {
        this.setState({
          showEmojiPicker: !this.state.showEmojiPicker,
        });
      }
      
    addEmoji(emoji) {
        ReactDOM.findDOMNode(this.refs.msg).value +=`${emoji.native}`;
        
        this.setState({
            showEmojiPicker:false
        })
    }

    submitMessage = (e)=> {
        e.preventDefault();

        console.log(this.props.user);
        this.setState({
            chats: this.state.chats.concat([{
                username: this.props.user.username,
                content: ReactDOM.findDOMNode(this.refs.msg).value,
                img: "https://img.icons8.com/clouds/2x/user.png",
            }])
        }, () => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
            let request = {
                game_id: this.props.roomPlaying.id,
                username: this.props.user.username,
                message:this.state.chats
            }
            console.log(request)
            this.props.user.socket.emit("chat-game-from-client", request);
        });
    }

    render() {
        const username = this.props.user.username;
        
        const { showEmojiPicker, chats } = this.state;

        return (
            <div className="chatroom">
                <h3>Chat</h3>
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) => 
                            <Message chat={chat} user={username} />
                        )
                    }
                    {showEmojiPicker ? (
                            <Picker set="emojione" onSelect={this.addEmoji} />
                            ) : null}
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    
                    <button
                        type="button"
                        className="toggle-emoji"
                        onClick={this.toggleEmojiPicker}
                    >
                        <span className="emoji-icon">😀</span>
                    </button>
                    <input type="text" ref="msg" pattern="^(?!\s*$).+" required/>
                    <input type="submit" value="Send" />
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => (
{
      user: state.user,
      chooseRoom: state.chooseRoom,
      userO: state.userOCurrent,
      roomPlaying: state.roomPlaying
}
);

export default connect(mapStateToProps)(ChatBox);