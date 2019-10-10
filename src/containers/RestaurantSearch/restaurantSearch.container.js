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
import data from '@solid/query-ldflex';
import { namedNode } from '@rdfjs/data-model';
import { fetchDocument, createDocument } from 'tripledoc';
import { solid, foaf, schema, space, rdf } from 'rdf-namespaces';


var location = {};

//Got the getCurrentPosition async/await from 
//https://blog.larapulse.com/es-2015/synchronous-fetch-browser-geolocation
function getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

const fetchCoordinates = async () => {
    try {
        const { coords } = await getCurrentPosition();
        const { latitude, longitude } = coords;
        return {latitude: latitude, longitude: longitude};
        // Handle coordinates
    } catch (error) {
        // Handle error
        console.error(error);
    }
};
async function addLocation(profile, locationList) {

    location = await fetchCoordinates();
  
    const newLocation = await locationList.addSubject();

    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
    newLocation.addLiteral(schema.latitude, location.latitude);
    newLocation.addLiteral(schema.longitude, location.longitude);

    const success = await locationList.save([newLocation]);
    return success;
}


//Code below taken and modified from https://vincenttunru.gitlab.io/tripledoc/docs/writing-a-solid-app
async function initialiseLocationList(profile, typeIndex) {
    const storage = profile.getNodeRef(space.storage);

    const locationListUrl = storage + 'public/location.ttl';

    
    //Create the new document
    const locationList = createDocument(locationListUrl);
    await locationList.save();

    //Store a reference to that document in the public Type Index;
    const typeRegistration = typeIndex.addSubject();
    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationList.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, solid.forClass)
    await typeIndex.save([ typeRegistration]);

    return locationList;
}

async function getLocationList(profile) {
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
    const locationListEntry = publicTypeIndex.findSubject(solid.forClass, schema.GeoCoordinates)

    if (locationListEntry === null) {
       return initialiseLocationList(profile, publicTypeIndex);
    }
    const locationListUrl = locationListEntry.getNodeRef(solid.instance);
    return await fetchDocument(locationListUrl);
}

const setLocation = (position) => {
   
   var location =  { 
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
  };

}

async function getData(webId) {
    // loading new events
    var latitude = "";
    var longitude = "";
    const webIdDoc = await fetchDocument(webId);
    /* 2. Read the Subject representing the current user: */
    const user = webIdDoc.getSubject(webId);
    /* 3. Get their foaf:name: */
    console.log(user.getLiteral(foaf.name));

    var locationList = await getLocationList(user);
    //What about getSafeLiteral instead of getLiteral  need node-solid-server
    //could use 
// two variables permission and actual location information...
    console.log("get data latitude" + user.getLiteral(schema.latitude));
    console.log("get data longitude" + user.getLiteral(schema.longitude));
    latitude = user.getLiteral(schema.latitude);
    longitude = user.getLiteral(schema.longitude);
   if ((latitude == null) || (longitude == null)) { 
        var status = await addLocation(webId, locationList);        
    }

} 

/**
 * We are using ldflex to fetch profile data from a solid pod.
 * ldflex libary is using json-LD for this reason you will see async calls
 * when we want to get a field value, why ? becuase they are expanded the data
 * this means the result will have a better format to read on Javascript.
 * for more information please go to: https://github.com/solid/query-ldflex
 */
 const RestaurantSearch = ({ ToastManager }) => {
    const webId = useWebId();
    console.log("Web ID: " + webId);
    //Not sure why they are using CUPurl instead of continuing to 
    //use the webId

 
     if (webId !== undefined) {
        //var CUPurl = webId.replace('profile/card#me', '') + 'private/events#';
        var CUPurl = webId;
        getData(CUPurl);
    } else {
        //Not fetched yet.
        const isLoading = true;
    }
    
    const image = '';
    const isLoading = false;
    const name = 'sharon';
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
                            name={name}
                            image={image}
                            isLoading={isLoading}
                        />
                        </Fragment>

                    )}
                </RestaurantSearchContainer>
            </RestaurantSearchWrapper>
        );
    
};

export default withToastManager(RestaurantSearch);
