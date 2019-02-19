import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 700
      }
    }
  }
};

const initialState = {
  input: '',
  imageUrl: '',
  box:  [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        email: data.email,
        id: data.id,
        name: data.name,
        entries: data.entries,
        joined: data.joined
    }
  });
};


calculateFaceLocation = (data) => {
  const clarifaiFaces = data.outputs[0].data.regions;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);

  const faces = clarifaiFaces.map(clarifaiFace => {
    return {
      leftCol: clarifaiFace.region_info.bounding_box.left_col * width,
      topRow: clarifaiFace.region_info.bounding_box.top_row * height,
      rightCol: width - (clarifaiFace.region_info.bounding_box.right_col * width),
      bottomRow: height - (clarifaiFace.region_info.bounding_box.bottom_row * height)
    };
  })

  return faces;
};

displayFaceBox = (box) => this.setState({box: box});
 

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('http://localhost:3001/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
      })
       .then(response => response.json())
       .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
      .then(response => response.json())
      .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
      .catch(console.log)
      }

      this.displayFaceBox(this.calculateFaceLocation(response))
    })
      .catch(err => console.log(err));
  }


  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
   const { isSignedIn, imageUrl, route, box } = this.state;
    
   return (
      <div className="App">
      <Particles className='particles'
      params={particlesOptions}         
      />
    
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
    { route === 'home' 
      ? ( <div>
      {" "}
      <Logo />
      <Rank 
        name={this.state.user.name}
        entries={this.state.user.entries}
      />
      <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit} 
        />
      
      <FaceRecognition box={box} imageUrl={imageUrl}/>
      </div>
     ) : ( 
      route === 'signin' 
      ? ( <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
      ) : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
    )
   }
  </div>
    );
  }
}

export default App;
