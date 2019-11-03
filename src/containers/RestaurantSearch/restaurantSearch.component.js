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
import auth  from 'solid-auth-client';


  const getWebId = async () =>  {
    try { 
      let session = await auth.currentSession();
      if (session) { 
        return session.webId;
      }
    } catch (err) {
      console.log(err);
    }
  }


const RestaurantCard = (props) => {

      return (
      <div className="card">
        <p>{props.restaurant}</p>
      </div>
      );
};

const RestaurantCardList = (props) => {
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
    //Need to remember how to get what was passed in from container
    //so I can grab lat and long
    //this.getRestaurants(this.props.latitude, this.props.longitude);
    this.getRestaurants(-37.7 , 144.9); 
  }


//Need to get the location from the solid server and convert to the entity_id 
   async getLocation() {
    var testProfile = await getWebId();
    //var name = getName(testProfile); 
    console.log(testProfile);
    //console.log("Name: " + name);

    return 'entity_id=94741%20&entity_type=zone';

   }

   getRestaurants = async (latitude, longitude) => {
       // var location = this.getLocation();
       var location = "lat=" + latitude + "&lon=" + longitude;
       console.log("location parameter: " + location);
       try { 
        const response = await zomato.get('/geocode', { 
            params: { 
              lat: latitude,
              lon: longitude
            }        
        });
        console.log(response.data);
         this.setState({ restaurants: response.data.nearby_restaurants });
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
