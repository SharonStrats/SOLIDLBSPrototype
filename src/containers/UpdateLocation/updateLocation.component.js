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

async function addLocation(profile, locationList) {
    var location = {latitude: 37.6106654, longitude: 23.3982429};
    const newLocation = await locationList.addSubject();
    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
    newLocation.addLiteral(schema.latitude, location.latitude);
    newLocation.addLiteral(schema.longitude, location.longitude);
    const success = await locationList.save([newLocation]);
    return success;

}




//Code below taken and modified from https://vincenttunru.gitlab.io/tripledoc/docs/writing-a-solid-app
async function initialiseLocationList(profile, typeIndex) {
    console.log("in initialize");
    const storage = profile.getNodeRef(space.storage);

    const locationDetailDocUrl = storage + 'public/detaillocation.ttl';
    //const locationApproxDocUrl = storage + 'public/approxlocation.ttl';
   // const locationGeneralDocUrl = storage + 'public/generallocation.ttl';

    //Create the new document
    const locationDetailDoc = createDocument(locationDetailDocUrl);
    //const locationApproxDoc = createDocument(locationApproxDocUrl);
    //const locationGeneralDoc = createDocument(locationGeneralDocUrl);
    await locationDetailDoc.save();
   // await locationApproxDoc.save();
   // await locationGeneralDoc.save();

    //Store a reference to that document in the public Type Index;
    const typeRegistration = typeIndex.addSubject();
    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationDetailDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await typeIndex.save([ typeRegistration]);
/*
    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationApproxDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await typeIndex.save([ typeRegistration]);

    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationGeneralDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await typeIndex.save([ typeRegistration]);
*/
    return  locationDetailDoc;
}

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
    const locationListEntry = publicTypeIndex.findSubject(solid.forClass, schema.GeoCoordinates)
    //locationListEntry should be the name of location urls
    //this really should contain all (need to look into data)

    //I should not initialize here because it should already be defined
    //otherwise I need to message "Location information is not available."
    console.log("location list entry: " + JSON.stringify(locationListEntry));
    //Because I am adding them I shouldn't need to do this....
   
    if (locationListEntry === null) {

       return initialiseLocationList(profile, publicTypeIndex);
    }
    //need a way to make sure for instance that this entry 1 is detail.
    try { //Detail
        var locationListUrl = await locationListEntry.getNodeRef(solid.instance);
        console.log("GET LOCATION " + JSON.stringify(locationListUrl));
        var locationDoc =  await fetchDocument(locationListUrl);
        console.log("Location Doc " + JSON.stringify(locationDoc));
    } catch (err) {
        console.log(err);
        try {  //Approximate
            locationListUrl = await locationListEntry[1].getNodeRef(solid.instance);
            console.log("GET LOCATION " + JSON.stringify(locationListUrl));
            return await fetchDocument(locationListUrl);
        } catch (err) {
            console.log(err);
            try { //General
                locationListUrl = await locationListEntry[2].getNodeRef(solid.instance);
                console.log("GET LOCATION " + JSON.stringify(locationListUrl));
                return await fetchDocument(locationListUrl);
            } catch (err) {
                console.log(err);
            }
        }
    }

    return locationDoc; // use null then to check that they do not have location services available
}
/*
  const getWebId = async () =>  {
    let session = await auth.currentSession();
    if (session) { 
      console.log(session);
      return session.webId;
    }

  } */

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

  state = {latitude: "", longitude: "", place: ""};

  

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
    // loading new events
    var latitude = "";
    var longitude = "";
    var locationDocs = [];
    const webIdDoc = await fetchDocument(webId);
    /* 2. Read the Subject representing the current user: */
    const user = webIdDoc.getSubject(webId);
    /* 3. Get their foaf:name: */
    var name = user.getLiteral(foaf.name);

    //These create the needed documents
    //var detailDoc = await createLocationDetailDoc(user);
    //var approxDoc = await createLocationApproxDoc(user);
    //var generalDoc = await createLocationGeneralDoc(user);

    //wondering if the methods above caused problems with the public index
    //trying the way i did it in the beginning because my account displays
    //but new accounts don't
    var locationDoc = await getLocationDoc(user);
    console.log("getData LocationDoc " + JSON.stringify(locationDoc));
     //should change the name to document
    //What about getSafeLiteral instead of getLiteral  need node-solid-server
    //could use 
// two variables permission and actual location information...

    const location = await locationDoc.getSubject();
    console.log("get data location " + JSON.stringify(location));
    console.log(location.getNodeRef(rdf.type, schema.GeoCoordinates)); //returning null
    latitude = location.getLiteral(schema.latitude); //returning null
    longitude = location.getLiteral(schema.longitude); //returning null
    
    console.log(latitude);
    console.log(longitude);
    if ((latitude == null) || (longitude == null)) { 
        var status = await addLocation(locationDoc);  
      
        console.log(status);      
    }  
    var place = await this.getPlace(latitude, longitude);
    console.log(place);
    this.setState({ latitude: latitude, longitude: longitude, place: place });
    return null;
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
