import React from 'react';
import isLoading from '@hocs/isLoading';
import { withTranslation } from 'react-i18next';
import './friendList.css';
import {
  WelcomeWrapper,
  WelcomeCard,
  LocationInputContainer,
  GoButton
} from './findMyFriend.style';
//import { RestaurantCard  } from './components';
//import { Container } from 'react-bootstrap';
import { withToastManager } from 'react-toast-notifications';
import openstreetmap from '../../api/openstreetmap';
import { fetchDocument } from 'tripledoc';
import { foaf, rdfs, rdf, solid, schema } from 'rdf-namespaces';
import auth  from 'solid-auth-client';


  function getName(profile) {
    return profile.getLiteral(foaf.name);
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
    console.log(this.props.webId);
    this.getFriends(this.props.webId);
      
  }


  getPlace = async (latitude, longitude) => {

    const response = await openstreetmap.get('/reverse', { 
            params: { format: "geocodejson", lat: latitude, lon: longitude}        
        }); 
    console.log("response " + JSON.stringify(response));
    return response.data.features[0].properties.geocoding.label;
 
  }

 getFriendLocationDoc = async(friend) => {
      try { 
       console.log("public type index " + friend );
        const publicTypeIndexUrl = friend.getNodeRef(solid.publicTypeIndex);
        console.log("public type index " + publicTypeIndexUrl );
        try { 
          const publicTypeIndex = await fetchDocument(publicTypeIndexUrl);
          const locationListEntry = publicTypeIndex.findSubjects(solid.forClass, schema.GeoCoordinates)
          
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
        } catch(err) {
        console.log(err);
      }
    } catch(err) {
      console.log(err);
    }

    return null;
 }

 getFriends = async(webId) => {
 
    var locationDoc = "";
    const webIdDoc = await fetchDocument(webId);
    const profile = webIdDoc.getSubject(webId);
    const friendsDocumentUrls = profile.getAllNodeRefs(foaf.knows);
  
   //friendsDocumentUrls is a list of links of friends, their web ID
    for (var i = 0; i < friendsDocumentUrls.length; i++) { 
 
       const friendsDocument = await fetchDocument(friendsDocumentUrls[i]);
        const friend = await friendsDocument.getSubject(friendsDocumentUrls[i]);
        

        var friendName = friend.getLiteral(foaf.name);
        console.log("Friend Name " + friendName);
      try { 
        locationDoc = await this.getFriendLocationDoc(friend);
        try { 
          const location = await locationDoc.getSubject();
          console.log("get data location " + JSON.stringify(location));
          console.log(location.getNodeRef(rdf.type, schema.GeoCoordinates)); //returning null
          var latitude = location.getLiteral(schema.latitude); //returning null
          var longitude = location.getLiteral(schema.longitude); //returning null
          var place = await this.getPlace(latitude, longitude);
          console.log(latitude);
          console.log(longitude);
          var friendToAdd = {id:i , name: friendName, latitude: latitude, longitude: longitude, location:place};
        
          var friends = [...friends, friendToAdd];
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
