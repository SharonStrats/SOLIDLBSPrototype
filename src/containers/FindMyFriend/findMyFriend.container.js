import React, { Fragment } from 'react';
import { withToastManager } from 'react-toast-notifications';
import { useWebId } from '@inrupt/solid-react-components';
import {
    Header,
    FindMyFriendContainer,
    FindMyFriendWrapper
} from './findMyFriend.style';
import { fetchDocument, createDocument } from 'tripledoc';
import { solid, foaf, schema, space, rdf, rdfs } from 'rdf-namespaces';
import FindMyFriendContent from './findMyFriend.component';


var location = {};




async function getFriendsDoc(profile) {

    const friendsDocumentUrl = profile.getNodeRef(foaf.knows);
    console.log("Friends URL: " + friendsDocumentUrl);
    const friendsDocument = await fetchDocument(friendsDocumentUrl);
    const friend = friendsDocument.getSubject(friendsDocumentUrl);

    const publicTypeIndexUrl = friend.getNodeRef(solid.publicTypeIndex);
    const publicTypeIndex = await fetchDocument(publicTypeIndexUrl);
    const locationListEntry = publicTypeIndex.findSubjects(solid.forClass, schema.GeoCoordinates)
    console.log("location entry: " + locationListEntry);
    try { //Detail
        var locationListUrl = await locationListEntry[1].getNodeRef(solid.instance);
        console.log("GET LOCATION " + JSON.stringify(locationListUrl));
        return await fetchDocument(locationListUrl);
    } catch (err) {
        console.log(err);
        try {  //Approximate
            locationListUrl = await locationListEntry[3].getNodeRef(solid.instance);
            console.log("GET LOCATION " + JSON.stringify(locationListUrl));
            return await fetchDocument(locationListUrl);
        } catch (err) {
            console.log(err);
            try { //General
                locationListUrl = await locationListEntry[5].getNodeRef(solid.instance);
                console.log("GET LOCATION " + JSON.stringify(locationListUrl));
                return await fetchDocument(locationListUrl);
            } catch (err) {
                console.log(err);
            }
        }
    }
    return null;
    //return await friendsDocument.getSubject(foaf.Person);
}

const getData = async webId => {
    // loading new events
    var latitude = "";
    var longitude = "";
    var locationDocs = [];
    const webIdDoc = await fetchDocument(webId);
    /* 2. Read the Subject representing the current user: */
    const user = webIdDoc.getSubject(webId);
    /* 3. Get their foaf:name: */
    var name = user.getLiteral(foaf.name);
   

    var getFriendList = await getFriendsDoc(user);

/*
    const location = await locationDoc.getSubject();
    console.log("get data location " + JSON.stringify(location));
    console.log(location.getNodeRef(rdf.type, schema.GeoCoordinates)); //returning null
    latitude = location.getLiteral(schema.latitude); //returning null
    longitude = location.getLiteral(schema.longitude); //returning null
    
    console.log(latitude);
    console.log(longitude);
 */
    return null;
} 

 const FindMyFriendSearch = ({ ToastManager }) => {
    const webId = useWebId();
    console.log("Web ID: " + webId);
    //Not sure why they are using CUPurl instead of continuing to 
    //use the webId

 
     if (webId !== undefined) {
        //var CUPurl = webId.replace('profile/card#me', '') + 'private/events#';
        var CUPurl = webId;
        var data = getData(CUPurl);
        console.log("Data name " + data.name);
        //getFriends(CUPurl);
    } else {
        //Not fetched yet.
        const isLoading = true;
    }
    
    const coolImage = '';
    const isLoading = false;
        return (
            <FindMyFriendWrapper data-testid="findmyfriend-component">
                <FindMyFriendContainer>
                    {webId && (
                        <Fragment>
                            <Header>
                            </Header>
                        <FindMyFriendContent
                            webId={CUPurl}
                            name={data.name}
                            image={coolImage}
                            isLoading={isLoading}
                        /> 
                        </Fragment>

                    )}
                </FindMyFriendContainer>
            </FindMyFriendWrapper>
        );
    
};

export default withToastManager(FindMyFriendSearch);
