import React, { Component } from 'react'
import './App.css';
import Input from './component/input';
import Matrix from './component/matrix';
import generateMatrix from './js/generateMatrix'

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      matrix: [],
      rows: 0,
      cols: 0,
      bombs: 0
    }
    this.changeState = this.changeState.bind(this);
    this.initMatrix = this.initMatrix.bind(this);
  }

  changeState(event){
    this.setState({[event.target.name]: event.target.value});
  }

  initMatrix(event){
    event.preventDefault();
    let rows = this.state.rows;
    let cols = this.state.cols;
    let bombs = this.state.bombs;
    this.setState({matrix: generateMatrix(rows, cols, bombs)});
  }

  render(){
    return (
      <div className="app">
        <Input initMatrix={this.initMatrix} changeState={this.changeState}/>
        <Matrix matrix={this.state.matrix}/>
      </div>
    )
  }
}

export default App;
