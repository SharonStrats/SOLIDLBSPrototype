import React from 'react';
import isLoading from '@hocs/isLoading';
import { withTranslation } from 'react-i18next';
import './updateLocation.css';
import {
  WelcomeWrapper,
  WelcomeCard,
  WeatherContainer,
  LocationInputContainer,
  GoButton
} from './updateLocation.style';
//import { RestaurantCard  } from './components';
//import { Container } from 'react-bootstrap';
import { withToastManager } from 'react-toast-notifications';
import { fetchDocument, createDocument } from 'tripledoc';
import { solid, foaf, schema, space, rdf, rdfs  } from 'rdf-namespaces';
import auth  from 'solid-auth-client';
import openstreetmap from '../../api/openstreetmap';


//Got the getCurrentPosition async/await from 
//https://blog.larapulse.com/es-2015/synchronous-fetch-browser-geolocation
function getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

const fetchCoordinates = async () => {
    try {
        const { coords } = await getCurrentPosition();
        const { latitude, longitude } = coords;
        return {latitude: latitude, longitude: longitude};
        // Handle coordinates
    } catch (error) {
        // Handle error
        console.error(error);
    }
};




async function getLocationDoc(profile) {
    //First attempt will be making it public, but really
    //want to make it private
    /*  
        Subject            Predicate                Object
        #location          rdf:type                 solid:TypeRegistration
        #location          solid:forClass           schema:GeoCoordinates
        #location          solid:instance           /public/location.ttl
    */
    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    const publicTypeIndex = await fetchDocument(publicTypeIndexUrl);
    const locationListEntries = publicTypeIndex.findSubjects(solid.forClass, schema.GeoCoordinates)
    
    if (typeof locationListEntries === 'undefined' || locationListEntries.length < 0) {
    // the array is defined and has at least one element
       return 1;
    }
    //need a way to make sure for instance that this entry 1 is detail.
    try { //Detail
        var locationListUrl = await locationListEntries[0].getNodeRef(solid.instance);
        var locationDoc =  await fetchDocument(locationListUrl);
    } catch (err) {
        console.log(err);
        try {  //Approximate
            locationListUrl = await locationListEntries[1].getNodeRef(solid.instance);
            return await fetchDocument(locationListUrl);
        } catch (err) {
            console.log(err);
            try { //General
                locationListUrl = await locationListEntries[2].getNodeRef(solid.instance);
                return await fetchDocument(locationListUrl);
            } catch (err) {
                console.log(err);
            }
        }
    }

    return locationDoc; // use null then to check that they do not have location services available
}


  function getName(profile) {
    return profile.getLiteral(foaf.name);
  }

const LocationCard = (props) => {

      return (
      <div className="card">
        <p>Latitude: {props.latitude}  Longitude: {props.longitude}</p>
        <p>{props.place}</p>
      </div>
      );
};


class UpdateLocationContent extends React.Component  {
  
  //var events = props.events;
  //var sd = props.selectedDate;

  state = {latitude: "", longitude: "", place: "", error: ""};

  

  componentDidMount() {
    var data = this.getData(this.props.webId);
      
  }


   getPlace = async (latitude, longitude) => {

    const response = await openstreetmap.get('/reverse', { 
            params: { format: "geocodejson", lat: latitude, lon: longitude}        
        }); 

    return response.data.features[0].properties.geocoding.label;
 
    }

  getData = async webId => {
    var latitude = "";
    var longitude = "";
    const webIdDoc = await fetchDocument(webId);
    /* 2. Read the Subject representing the current user: */
    const user = webIdDoc.getSubject(webId);
    /* 3. Get their foaf:name: */
    var name = user.getLiteral(foaf.name);


    //wondering if the methods above caused problems with the public index
    //trying the way i did it in the beginning because my account displays
    //but new accounts don't
    var locationDoc = await getLocationDoc(user);
    if (locationDoc === 1) {
      this.setState({ error: "Your location is unknown" });
    } else { 
      console.log("location doc " + JSON.stringify(locationDoc));
      const location = await locationDoc.getSubject();
      latitude = location.getLiteral(schema.latitude); 
      longitude = location.getLiteral(schema.longitude); 
    
      if ((latitude == null) || (longitude == null)) { 
        //var status = await addLocation(locationDoc);  
      
        //console.log(status);      
      }  
      var place = await this.getPlace(latitude, longitude);
      this.setState({ latitude: latitude, longitude: longitude, place: place });
    }
} 

  render() { 
    
  
  return (
    // props.isLoading ? <WelcomeWrapper data-testid="welcome-wrapper"><LoadingScreen /> </WelcomeWrapper> :
    <WelcomeWrapper data-testid="welcome-wrapper">
      <WelcomeCard className="card">
        <h3>
          Welcome <span>{this.props.name}</span>
        </h3>
        <p>
          Your location is: 
        </p>
      <LocationCard latitude={this.state.latitude} longitude={this.state.longitude} place={this.state.place}/>
      </WelcomeCard>
   
    </WelcomeWrapper>
  );
  }
};


export { UpdateLocationContent };
export default withTranslation()(
  isLoading(withToastManager(UpdateLocationContent))
);
