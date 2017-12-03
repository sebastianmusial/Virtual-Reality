import React, { Component } from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  View,
} from 'react-vr';
import TimerMixin from 'react-timer-mixin';

export default class PanoramaReactVR extends Component {
  constructor(props) {
    super(props)
    this.state = {
      positionY: 100,
      speed: 0.15,
    }
  }

  componentDidMount() { 
    TimerMixin.setInterval(() => { 
        this.setState({ 
          positionY: this.state.positionY + this.state.speed 
        }); 
      },
      1
    )
  } 
  
  render() {
    return (
      <View>
        <Pano 
          source={asset('panorama-sferyczna.jpg')} 
          style={{ transform: [ {rotateY: this.state.positionY} ], }}
        />
      </View>
    );
  }
};

AppRegistry.registerComponent('PanoramaReactVR', () => PanoramaReactVR);
