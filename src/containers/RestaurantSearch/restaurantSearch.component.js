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

const RestaurantCard = (props) => {

      return (
      <div className="card">
        <p>{props.restaurant}</p>
      </div>
      );
};

const RestaurantCardList = (props) => {
    console.log(props.restaurants);
    const restaurants = props.restaurants.map((restaurant) => {
      return <RestaurantCard key={restaurant.restaurant.id} restaurant={restaurant.restaurant.name} />
  }); 
      return <div className="restaurant-list">{restaurants}</div>;  
};

class RestaurantSearchContent extends React.Component  {
  
  //var events = props.events;
  //var sd = props.selectedDate;

  state = {restaurants: []};

  componentDidMount() {
    this.getRestaurants();
      
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

   getRestaurants = async (term) => {
        var location = this.getLocation();
        const response = await zomato.get('/search', { 
            params: { query: location }        
        });
       
        this.setState({ restaurants: response.data.restaurants });
        
    }
  render() { 
    
  
  return (
    // props.isLoading ? <WelcomeWrapper data-testid="welcome-wrapper"><LoadingScreen /> </WelcomeWrapper> :
    <WelcomeWrapper data-testid="welcome-wrapper">
      <WelcomeCard className="card">
        <h3>
          Welcome <span>{this.props.name}</span>
        </h3>
        <LocationInputContainer>
          <p>Show me restaurants in <input id='locationInput' placeholder="city state" /><GoButton onClick={() => console.log("hello")}>Go!</GoButton></p>
          <span id='inputErrorMessage' />
        </LocationInputContainer>
        <p>
          Now showing you restaurants nearby <span>{this.props.city}, {this.props.state}</span>
        </p>
      <RestaurantCardList restaurants={this.state.restaurants}/>
      </WelcomeCard>
      <WeatherContainer>

      </WeatherContainer>
    </WelcomeWrapper>
  );
  }
};


export { RestaurantSearchContent };
export default withTranslation()(
  isLoading(withToastManager(RestaurantSearchContent))
);
