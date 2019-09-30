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

async function getData(webId) {
    // loading new events
    const webIdDoc = await fetchDocument(webId);
    /* 2. Read the Subject representing the current user: */
    const user = webIdDoc.getSubject(webId);
    /* 3. Get their foaf:name: */
    console.log(user.getLiteral(foaf.name));

    getLocationList(user);
    console.log(user.getLiteral(schema.latitude));
    console.log(user.getLiteral(schema.longitude));
    //A little unsure about how to represent this, store lat and long separately or
    //should I used the geo class which is a GeoCoordinates and that has 
    //properties  latitude, longitude, postalCode, address and addressCountry.
    //console.log(user.getLiteral(schema.geo))

    //return an object with name and location

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
    //Not sure what the if statement below is doing..
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
