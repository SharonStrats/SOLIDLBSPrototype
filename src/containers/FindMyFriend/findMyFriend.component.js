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

const FriendCard = (props) => {

      return (
      <div className="card">
        <p>{props.friend}</p>
      </div>
      );
};

const FriendCardList = (props) => {
    console.log("Friends" + props.friends);
    const friends = props.friends.map((friend) => {
      return <FriendCard key={friend.id} friend={friend.name} latitude={friend.latitude} longitude={friend.longitude} />
  }); 
      return <div className="friend-list">{friends}</div>;  
};

class FindMyFriendContent extends React.Component  {
  
  
  //var sd = props.selectedDate;

  state = {friends: []};

  componentDidMount() {
    console.log(this.props.webId);
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


    for (var i = 1; i < friendsDocumentUrls.length; i++) { 

      try { 
        const friendsDocument = await fetchDocument(friendsDocumentUrls[1]);
        console.log("friend document " + JSON.stringify(friendsDocument));
        const friend = friendsDocument.getSubject(friendsDocumentUrls[1]);


        var friendName = friend.getLiteral(foaf.name);
        console.log("friend " + JSON.stringify(friend));
        const publicTypeIndexUrl = friend.getNodeRef(solid.publicTypeIndex);
        console.log("public type index " + publicTypeIndexUrl);
      try { 
        const publicTypeIndex = await fetchDocument(publicTypeIndexUrl);
        const locationListEntry = publicTypeIndex.findSubjects(solid.forClass, schema.GeoCoordinates)
        console.log("location entry: " + locationListEntry);
        try { //Detail
          var locationListUrl = await locationListEntry[0].getNodeRef(solid.instance);
          console.log("GET LOCATION " + JSON.stringify(locationListUrl));
          locationDoc = await fetchDocument(locationListUrl);
        } catch (err) {
          console.log(err);
          try {  //Approximate
            locationListUrl = await locationListEntry[1].getNodeRef(solid.instance);
            console.log("GET LOCATION " + JSON.stringify(locationListUrl));
            locationDoc = await fetchDocument(locationListUrl);
          } catch (err) {
            console.log(err);
            try { //General
                locationListUrl = await locationListEntry[2].getNodeRef(solid.instance);
                console.log("GET LOCATION " + JSON.stringify(locationListUrl));
                locationDoc = await fetchDocument(locationListUrl);
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

      const location = await locationDoc.getSubject();
      console.log("get data location " + JSON.stringify(location));
      console.log(location.getNodeRef(rdf.type, schema.GeoCoordinates)); //returning null
      var latitude = location.getLiteral(schema.latitude); //returning null
      var longitude = location.getLiteral(schema.longitude); //returning null
    
      console.log(latitude);
      console.log(longitude);
    } 
   this.setState({friends: [ {id: "1", name: friendName, latitude: latitude, longitude: longitude} ]});
    

    return null;
    //return await friendsDocument.getSubject(foaf.Person);
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
          My friends: 
        </p>
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
