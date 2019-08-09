import React, { Component } from 'react'
import '../css/cell.css'
import { FaCog } from 'react-icons/fa' 

export class Cell extends Component {  

    render(){
        var content = this.props.content;
        var style = {};
        if(content<0){
            content = <FaCog/>
            style = Object.assign({}, style, {background: 'red'});
        }
        else if(content===0){
            content='';
        }

        return (
            <div className="cell" style={style}>
                {content}
            </div>
        )
    }
}

export default Cell;