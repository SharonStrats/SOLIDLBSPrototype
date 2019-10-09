import React from 'react';
import isLoading from '@hocs/isLoading';
import { withTranslation } from 'react-i18next';
import './restaurantList.css';
import {
  WelcomeWrapper,
  WelcomeCard,
  WeatherContainer,
  LocationInputContainer,
  GoButton
} from './restaurantSearch.style';
//import { RestaurantCard  } from './components';
//import { Container } from 'react-bootstrap';
import { withToastManager } from 'react-toast-notifications';
import zomato from '../../api/zomato';
import { fetchDocument } from 'tripledoc';
import { foaf, rdfs } from 'rdf-namespaces';
import auth  from 'solid-auth-client';


  const getWebId = async () =>  {
    let session = await auth.currentSession();
    if (session) { 
      console.log(session);
      return session.webId;
    }

    //const identityProvider = await getIdentifyProvider();

    //auth.login(identityProvider);
  }

  function getName(profile) {
    return profile.getLiteral(foaf.name);
  }

const LocationCard = (props) => {

      return (
      <div className="card">
        <p>{props.location}</p>
      </div>
      );
};



class UserLocationContent extends React.Component  {
  
  //var events = props.events;
  //var sd = props.selectedDate;

  state = {location: []};

  componentDidMount() {
    this.getLocation();
      
  }



 /* async function getFriends(profile) {
    const friendsDocumentUrl = profile.getNodeRef(rdfs.seeAlso);
    const friendsDocument = await fetchDocument(friendsDocumentUrl);
    return friendsDocument.getSubjectsOfType(foaf.Person);
  } */

//Need to get the location from the solid server and convert to the entity_id 
   async getLocation() {
    var testProfile = await getWebId();
    //var name = getName(testProfile); 
    console.log(testProfile);
    //console.log("Name: " + name);

    return 'entity_id=94741%20&entity_type=zone';

   }

   getLocation = async (term) => {
        var location = this.getLocation();
     
        this.setState({ location: "" });
        
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
      <LocationCard restaurants={this.state.location}/>
      </WelcomeCard>
   
    </WelcomeWrapper>
  );
  }
};


export { LocationContent };
export default withTranslation()(
  isLoading(withToastManager(LocationContent))
);
