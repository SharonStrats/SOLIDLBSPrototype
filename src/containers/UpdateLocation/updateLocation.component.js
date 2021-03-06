import React from 'react';
import isLoading from '@hocs/isLoading';
import { withTranslation } from 'react-i18next';
import './updateLocation.css';
import {
  WelcomeWrapper,
  WelcomeCard
} from './updateLocation.style';
import { withToastManager } from 'react-toast-notifications';
import { fetchDocument } from 'tripledoc';
import { solid, schema } from 'rdf-namespaces';
import openstreetmap from '../../api/openstreetmap';


async function getLocationDocument(locationListEntry) {
  try {
      var locationListUrl = await locationListEntry.getNodeRef(solid.instance);
      try {
        return await fetchDocument(locationListUrl);
      } catch (err) {
        console.log(err);
      }
  } catch (err) {
    console.log(err);
  }

        
}

async function selectAuthorizedLocationDoc(profile) {
    //First attempt will be making it public, but really
    //want to make it private
    /*  
        Subject            Predicate                Object
        #location          rdf:type                 solid:TypeRegistration
        #location          solid:forClass           schema:GeoCoordinates
        #location          solid:instance           /public/location.ttl
    */
    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    try { 
      const publicTypeIndex = await fetchDocument(publicTypeIndexUrl);
      const locationListEntries = publicTypeIndex.findSubjects(solid.forClass, schema.GeoCoordinates);

      if (locationListEntries.length >= 0)  {
  
        try { //Detail
          return await getLocationDocument(locationListEntries[0]);
        } catch (err) {
          console.log(err);
          try {  //Approximate
            return await getLocationDocument(locationListEntries[1]);
          } catch (err) {
            console.log(err);
            try { //General
                return await getLocationDocument(locationListEntries[2]);
            } catch (err) {
                console.log(err);
            }
          }
        }
      } else {
        return 1;
      } 
    } catch (err) {
      console.log(err);
    }
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
    this.getData(this.props.webId);
      
  }

   getPlace = async (latitude, longitude) => {
    try { 
      const response = await openstreetmap.get('/reverse', { 
            params: { format: "geocodejson", lat: latitude, lon: longitude}        
        }); 
      console.log("Response " + JSON.stringify(response));
      return response.data.features[0].properties.geocoding.label;
    } catch (err) {
      console.log(err);
    }
  }

  getData = async webId => {
    var latitude = "";
    var longitude = "";
    try { 
      const webIdDoc = await fetchDocument(webId);
      /* 2. Read the Subject representing the current user: */
      const user = webIdDoc.getSubject(webId);
      /* 3. Get their foaf:name: */
      //var name = user.getLiteral(foaf.name);

      try { 
        var locationDoc = await selectAuthorizedLocationDoc(user);
 
        if (locationDoc === 1) {
          this.setState({ error: "Your location is unknown" });
        } else { 
          try { 
            const location = await locationDoc.getSubject();
            latitude = location.getLiteral(schema.latitude); 
            longitude = location.getLiteral(schema.longitude); 
            try { 
              var place = await this.getPlace(latitude, longitude);
              this.setState({ latitude: latitude, longitude: longitude, place: place });
            } catch (err) {
              console.log(err);
            }
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log(err);
      }  
    } catch (err) {
      console.log(err);
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
