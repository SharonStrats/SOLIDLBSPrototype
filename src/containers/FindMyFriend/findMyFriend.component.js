import React from 'react';
import isLoading from '@hocs/isLoading';
import { withTranslation } from 'react-i18next';
import './friendList.css';
import {
  WelcomeWrapper,
  WelcomeCard
} from './findMyFriend.style';
//import { RestaurantCard  } from './components';
//import { Container } from 'react-bootstrap';
import { withToastManager } from 'react-toast-notifications';
import openstreetmap from '../../api/openstreetmap';
import { fetchDocument } from 'tripledoc';
import { foaf, solid, schema } from 'rdf-namespaces';

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
const FriendCard = (props) => {
      return (
      <div className="card">
        <h4>{props.friend}</h4>
        <h5>{props.location}</h5>
        <h6>Lat: {props.latitude} Lon: {props.longitude}</h6>
      </div>
      );
};

const FriendCardList = (props) => {
  if (!props.friends) {
    return <div>Loading... </div>
  }
    const friends = props.friends.map((friend) => {
      return <FriendCard key={friend.id} friend={friend.name} latitude={friend.latitude} longitude={friend.longitude} location={friend.location}  />
  }); 
      return <div className="friend-list">{friends}</div>;  
};

class FindMyFriendContent extends React.Component  {
  
  state = {friends: []};

  componentDidMount() {
  
    this.getFriends(this.props.webId);
      
  }


  getPlace = async (latitude, longitude) => {

    const response = await openstreetmap.get('/reverse', { 
            params: { format: "geocodejson", lat: latitude, lon: longitude}        
        }); 
   
    return response.data.features[0].properties.geocoding.label;
 
  }

 getFriends = async(webId) => {
 
    var locationDoc = "";
    const webIdDoc = await fetchDocument(webId);
    const profile = webIdDoc.getSubject(webId);
    const friendsDocumentUrls = profile.getAllNodeRefs(foaf.knows);
  
   //friendsDocumentUrls is a list of links of friends, their web ID
   //Need to handle if they have no friends.  Display no friends or something like that
    for (var i = 0; i < friendsDocumentUrls.length; i++) { 
 
      const friendsDocument = await fetchDocument(friendsDocumentUrls[i]);
      const friend = await friendsDocument.getSubject(friendsDocumentUrls[i]);
      var friendName = friend.getLiteral(foaf.name);
   
      try { 
        locationDoc = await selectAuthorizedLocationDoc(friend);
        try { 
          const location = await locationDoc.getSubject();
          var latitude = location.getLiteral(schema.latitude); //returning null
          var longitude = location.getLiteral(schema.longitude); //returning null
          try { 
            var place = await this.getPlace(latitude, longitude);
              
            var friendToAdd = {id:i , name: friendName, latitude: latitude, longitude: longitude, location:place};
        
            var friends = [...friends, friendToAdd];
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
   if (typeof friends !== 'undefined' && friends.length > 0) { 
    friends.shift(); //need to take out null, look into not having it there in the first place
   }
   console.log("Friends " + JSON.stringify(friends));
   this.setState({friends: friends});
    

    return null;
}

  render() { 
    
  
    return (
      <WelcomeWrapper data-testid="welcome-wrapper">
        <WelcomeCard className="card">
          <h3>Friends</h3>
          <FriendCardList friends={this.state.friends}/>
        </WelcomeCard>
      </WelcomeWrapper>
  );
  }
};


export { FindMyFriendContent };
export default withTranslation()(
  isLoading(withToastManager(FindMyFriendContent))
);
