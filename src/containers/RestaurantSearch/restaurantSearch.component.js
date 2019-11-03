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
        console.log(response.data);
         this.setState({ restaurants: response.data.nearby_restaurants });
       } catch (err) {
        console.log(err);
       }
         
    }


getLocationDoc = async profile => {
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
    const locationListEntry = publicTypeIndex.findSubjects(solid.forClass, schema.GeoCoordinates)
    //locationListEntry should be the name of location urls
    //this really should contain all (need to look into data)

    //I should not initialize here because it should already be defined
    //otherwise I need to message "Location information is not available."
    console.log("location list entry: " + JSON.stringify(locationListEntry));
    if (locationListEntry === null) {
      // return initialiseLocationList(profile, publicTypeIndex);
    }
    //need a way to make sure for instance that this entry 1 is detail.
    try { //Detail
        var locationListUrl = await locationListEntry[0].getNodeRef(solid.instance);
        return await fetchDocument(locationListUrl);
    } catch (err) {
        console.log(err);
        try {  //Approximate
            locationListUrl = await locationListEntry[1].getNodeRef(solid.instance);
            return await fetchDocument(locationListUrl);
        } catch (err) {
            console.log(err);
            try { //General
                locationListUrl = await locationListEntry[2].getNodeRef(solid.instance);
                return await fetchDocument(locationListUrl);
            } catch (err) {
                console.log(err);
            }
        }
    }
    return null; // use null then to check that they do not have location services available
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
            var locationDoc = await this.getLocationDoc(user);
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
          Now showing you restaurants nearby <span> May add city and state back in</span>
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
