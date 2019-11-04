import React from 'react';
import isLoading from '@hocs/isLoading';
import { withTranslation } from 'react-i18next';
import './restaurantList.css';
import {
  WelcomeWrapper,
  WelcomeCard
} from './restaurantSearch.style';
//import { RestaurantCard  } from './components';
//import { Container } from 'react-bootstrap';
import { withToastManager } from 'react-toast-notifications';
import zomato from '../../api/zomato';
import { fetchDocument} from 'tripledoc';
import { solid,  schema} from 'rdf-namespaces';


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


const RestaurantCard = (props) => {

      return (
      <div className="card">
        <h4>{props.restaurant}</h4>
        <p>{props.address}</p>
      </div>
      );
};

const RestaurantCardList = (props) => {
    const restaurants = props.restaurants.map((restaurant) => {
      return <RestaurantCard key={restaurant.restaurant.id} restaurant={restaurant.restaurant.name} address={restaurant.restaurant.location.address} />
  }); 
      return <div className="restaurant-list">{restaurants}</div>;  
};


class RestaurantSearchContent extends React.Component  {
  
  //var events = props.events;
  //var sd = props.selectedDate;

  state = {name: "" ,restaurants: []};

  componentDidMount() {
  
    this.getData(this.props.webId);

   
  }

   getRestaurants = async (latitude, longitude) => {

       try { 
        const response = await zomato.get('/geocode', { 
            params: { 
              lat: latitude,
              lon: longitude
            }        
        });
        console.log(response.data.nearby_restaurants[0].restaurant.location.address);
         this.setState({ restaurants: response.data.nearby_restaurants });
       } catch (err) {
        console.log(err);
       }
         
    }

  getData = async webId => {
    // loading new events
    var latitude = "";
    var longitude = "";
    try { 
        const webIdDoc = await fetchDocument(webId);
        /* 2. Read the Subject representing the current user: */
        const user = webIdDoc.getSubject(webId);

        try { 
            var locationDoc = await selectAuthorizedLocationDoc(user);
            try { 
                const location = await locationDoc.getSubject();
                latitude = location.getLiteral(schema.latitude); //returning null
                longitude = location.getLiteral(schema.longitude); //returning null
                this.getRestaurants(latitude, longitude);
            } catch (err) {
                console.log(err);
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
          Welcome <span></span>
        </h3>
 
        <p>
          Now showing you restaurants nearby 
        </p>
      <RestaurantCardList restaurants={this.state.restaurants}/>
      </WelcomeCard>
    </WelcomeWrapper>
  );
  }
};


export { RestaurantSearchContent };
export default withTranslation()(
  isLoading(withToastManager(RestaurantSearchContent))
);
