import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Progress from 'react-progressbar';


const Track = styled.div`
    width: 100%;
    height: 10px;
    background-color: #222;
    border-radius: 5px;
    box-shadow: inset 0 0 5px #000;
    margin-top: 8px;
`;

const Thumb = styled.div`
    width: ${props => props.percentage}%;
    height: 100%;
    background-color: #18A0FB;
    border-radius: 5px;
    transition: width 0.3s ease-in-out;
`;

export default class CustomProgressBar extends React.Component{
    render(){
        return(
            <Track>
                <Thumb percentage={this.props.percentage} />
            </Track>
        );
    }
}

CustomProgressBar.propsType = {
        percentage: PropTypes.number
}