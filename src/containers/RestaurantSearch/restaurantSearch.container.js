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
import { fetchDocument} from 'tripledoc';
import { solid, foaf, schema} from 'rdf-namespaces';


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

const getData = async webId => {
    // loading new events
    var latitude = "";
    var longitude = "";
    try { 
        const webIdDoc = await fetchDocument(webId);
        /* 2. Read the Subject representing the current user: */
        const user = webIdDoc.getSubject(webId);
        /* 3. Get their foaf:name: */
        var name = user.getLiteral(foaf.name);

        try { 
            var locationDoc = await getLocationDoc(user);
            try { 
                const location = await locationDoc.getSubject();
                latitude = location.getLiteral(schema.latitude); //returning null
                longitude = location.getLiteral(schema.longitude); //returning null
    
                return { name: {name}, latitude: {latitude}, longitude: {longitude} };
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


 const RestaurantSearch = ({ ToastManager }) => {
    var isLoading = true;
    const webId = useWebId();
 
     if (webId !== undefined) {
        var data = getData(webId);
        isLoading = false;
    } 
    
        return (
            <RestaurantSearchWrapper data-testid="restaurant-component">
                <RestaurantSearchContainer>
                    {webId && (
                        <Fragment>
                            <Header>
                            </Header>
                        <RestaurantSearchContent
                            lat={data.latitude}
                            lon={data.longitude}
                            name={data.name}
                            isLoading={isLoading}
                        />
                        </Fragment>

                    )}
                </RestaurantSearchContainer>
            </RestaurantSearchWrapper>
        );
    
};

export default withToastManager(RestaurantSearch);
