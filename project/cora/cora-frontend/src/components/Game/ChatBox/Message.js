    
import React from 'react';

const Message = ({chat, user}) => (
    <li className={`chat ${user === chat.username ? "right" : "left"}`}>
        {user !== chat.username
            && <img src={chat.img} alt={`${chat.username}'s profile pic`} />
        }
        <p>{chat.content}</p>
    </li>
);

export default Message;