import React from 'react';
import './index.css';

export default class App extends React.Component {
  // structure: state, didMount, render left and right divs 
  constructor() {
    super();
    this.state = {
      zoom: 17,
      maptype: 'hybrid',
      place_formatted: '',
      place_id: '',
      place_location: '',
      place_lat:'',
      place_lng:'',
    };
  }
  componentDidMount() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.5228, lng: -122.6762},
      zoom: 17,
      mapTypeId: 'hybrid',
      fontSize: "5px"
    });

    map.addListener('zoom_changed', () => {
      this.setState({
        zoom: map.getZoom(),
      });
    });

    map.addListener('maptypeid_changed', () => {
      this.setState({
        maptype: map.getMapTypeId(),
      });
    });

    let marker = new window.google.maps.Marker({
      map: map,
      position: {lat: 45.5228, lng: -122.6762},
    });
    
    // initialize the autocomplete functionality using the #pac-input input box
    let inputNode = document.getElementById('pac-input');
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputNode);
    let autoComplete = new window.google.maps.places.Autocomplete(inputNode);
    
    autoComplete.addListener('place_changed', () => {
      let place = autoComplete.getPlace();
      let location = place.geometry.location;
      /*let locationArray=location.toString().split(",");
      let lat=locationArray[0];
      let lng=locationArray[1];
      let lat2=lat.split("");
      if (lat2[0]=="-"){
        lat2.unshift("S ");
      };
      else{
        lat2.unshift("N ");
      }
      latComplete=lat2.join("");
      */

      this.setState({
        place_formatted: place.formatted_address,
        place_id: place.place_id,
        place_location: location.toString(),
        /*
        place_lat: lat.toString(),
        place_lng: lng.toString(),
        */
      });
    
      // bring the selected place in view on the map
      map.fitBounds(place.geometry.viewport);
      map.setCenter(location);
    
      marker.setPlace({
        placeId: place.place_id,
        location: location,
      });
    });
  }

  render() {
    return (
      <div id='app'>
        <div id="heading">
        <h3>Neighborhood explorer</h3>
        </div>
        <div id="state">
          <LocationsDashboard />
          <p>
            zoom level: {this.state.zoom}
            <br />
            Map type: {this.state.maptype}
            Place: {this.state.place_formatted}
            Location: {this.state.place_location}
          </p>
        </div>

        <div id='pac-container'>
          <input id="pac-input" type="text" placeholder="enter a location"/>
        </div>

        <div id='map' />{/*map*/}
      </div>//app
    ); 
  } 
};

class LocationsDashboard extends React.Component {
  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
        <EditableLocationList />
        <ToggleableLocationForm />
          isOpen={true}
        />
        </div>
      </div>
    );
  }
};

