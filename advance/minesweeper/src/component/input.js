import React, { Component } from 'react'
import '../css/input.css'
import { FaCog } from 'react-icons/fa' 

export class Input extends Component{
    render(){
        return(
            <form onSubmit={this.props.initMatrix}>

                <h1><FaCog className="cog"/>Minesweeper<FaCog className="cog"/></h1>
                
                <table>
                    <tbody>
                    <tr>
                        <th>Rows:</th>
                        <th>Columns:</th>
                        <th>Bombs:</th>
                        <th></th>
                    </tr>
                    <tr>
                        <td>
                            <input type="number" name="rows" min="1" max="100" onChange={this.props.changeState} required></input>
                        </td> 
                        <td>
                            <input type="number" name="cols" min="1" max="100" onChange={this.props.changeState} required></input>
                        </td> 
                        <td>
                        <input type="number" name="bombs" min="1" max="10000" onChange={this.props.changeState} required></input>
                        </td> 
                        <td>
                            <button type="submit">Generate</button>
                        </td>
                    </tr>
                    </tbody>
                
                </table>

                

            </form>

        )
    }
}

export default Input;