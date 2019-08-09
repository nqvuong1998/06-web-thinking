import React, { Component } from 'react'
import Row from './row'
import '../css/matrix.css'

export class Matrix extends Component{

    initRows(){
        let matrix = this.props.matrix;
        let rows = []
        matrix.forEach((element, i) => {
            rows.push(<Row key={i} rows={element}/>)
        });
        return rows;
    }
    

    render(){
        return (
            <div className="matrix">
               {this.initRows()}
            </div>
        )
    }
}

export default Matrix;