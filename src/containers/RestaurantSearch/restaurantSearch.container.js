import React, { Fragment } from 'react';
import RestaurantSearchContent from './restaurantSearch.component';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withToastManager } from 'react-toast-notifications';
import { useWebId } from '@inrupt/solid-react-components';
import {
    Header,
    RestaurantSearchContainer,
    RestaurantSearchWrapper
} from './restaurantSearch.style';
//import data from '@solid/query-ldflex';
//import { namedNode } from '@rdfjs/data-model';
import { fetchDocument, createDocument } from 'tripledoc';
import { solid, foaf, schema, space, rdf, rdfs } from 'rdf-namespaces';


var location = {};


async function getLocationDoc(profile) {
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
        console.log("GET LOCATION " + JSON.stringify(locationListUrl));
        return await fetchDocument(locationListUrl);
    } catch (err) {
        console.log(err);
        try {  //Approximate
            locationListUrl = await locationListEntry[1].getNodeRef(solid.instance);
            console.log("GET LOCATION " + JSON.stringify(locationListUrl));
            return await fetchDocument(locationListUrl);
        } catch (err) {
            console.log(err);
            try { //General
                locationListUrl = await locationListEntry[2].getNodeRef(solid.instance);
                console.log("GET LOCATION " + JSON.stringify(locationListUrl));
                return await fetchDocument(locationListUrl);
            } catch (err) {
                console.log(err);
            }
        }
    }
    return null; // use null then to check that they do not have location services available
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

    //These create the needed documents
    //var detailDoc = await createLocationDetailDoc(user);
    //var approxDoc = await createLocationApproxDoc(user);
    //var generalDoc = await createLocationGeneralDoc(user);
    var locationDoc = await getLocationDoc(user);
    console.log("getData LocationDoc " + JSON.stringify(locationDoc));
     //should change the name to document
    //What about getSafeLiteral instead of getLiteral  need node-solid-server
    //could use 
// two variables permission and actual location information...

    const location = await locationDoc.getSubject();
    console.log("get data location " + JSON.stringify(location));
    console.log(location.getNodeRef(rdf.type, schema.GeoCoordinates)); //returning null
    latitude = location.getLiteral(schema.latitude); //returning null
    longitude = location.getLiteral(schema.longitude); //returning null
    
    console.log(latitude);
    console.log(longitude);
   /* if ((latitude == null) || (longitude == null)) { 
        var status = await addLocation(locationDoc);  
      
        console.log(status);      
    }  */
    return { name: {name} };
} 


 const RestaurantSearch = ({ ToastManager }) => {
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
            <RestaurantSearchWrapper data-testid="restaurant-component">
                <RestaurantSearchContainer>
                    {webId && (
                        <Fragment>
                            <Header>
                            </Header>
                        <RestaurantSearchContent
                            city="Melbourne"
                            state="Victoria"
                            name={data.name}
                            image={coolImage}
                            isLoading={isLoading}
                        />
                        </Fragment>

                    )}
                </RestaurantSearchContainer>
            </RestaurantSearchWrapper>
        );
    
};

export default withToastManager(RestaurantSearch);
