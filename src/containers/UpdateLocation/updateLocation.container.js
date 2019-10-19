import React, { Fragment } from 'react';
import UpdateLocationContent from './updateLocation.component';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withToastManager } from 'react-toast-notifications';
import { useWebId } from '@inrupt/solid-react-components';
import {
    Header,
    UpdateLocationContainer,
    UpdateLocationWrapper
} from './updateLocation.style';
//import data from '@solid/query-ldflex';
//import { namedNode } from '@rdfjs/data-model';
import { fetchDocument, createDocument } from 'tripledoc';
import { solid, foaf, schema, space, rdf, rdfs } from 'rdf-namespaces';


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

async function createLocationDetailDoc(profile) {

    var location = await fetchCoordinates();
    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    const publicTypeIndex = await fetchDocument(publicTypeIndexUrl); 
    const storage = profile.getNodeRef(space.storage);

    const locationDetailDocUrl = storage + 'public/detaillocation.ttl';   
    const locationDetailDoc = createDocument(locationDetailDocUrl);

    await locationDetailDoc.save();

    const typeRegistration = publicTypeIndex.addSubject();
    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationDetailDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await publicTypeIndex.save([ typeRegistration]);

  
    const newLocation = await locationDetailDoc.addSubject();

    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
    newLocation.addLiteral(schema.latitude, location.latitude);
    newLocation.addLiteral(schema.longitude, location.longitude);
    const success = await locationDetailDoc.save([newLocation]);


    return success;
}

async function createLocationApproxDoc(profile) {

    var location = await fetchCoordinates();

    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    const publicTypeIndex = await fetchDocument(publicTypeIndexUrl); 
    const storage = profile.getNodeRef(space.storage);

    const locationApproxDocUrl = storage + 'public/approxlocation.ttl';   
    const locationApproxDoc = createDocument(locationApproxDocUrl);

    await locationApproxDoc.save();

    const typeRegistration = publicTypeIndex.addSubject();
    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationApproxDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await publicTypeIndex.save([ typeRegistration]);

    const newLocation = await locationApproxDoc.addSubject();

    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
    newLocation.addLiteral(schema.latitude, location.latitude.toFixed(5));
    newLocation.addLiteral(schema.longitude, location.longitude.toFixed(5));
    const success = await locationApproxDoc.save([newLocation]);


    return success;
}
async function createLocationGeneralDoc(profile) {

    var location = await fetchCoordinates();
    
    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    const publicTypeIndex = await fetchDocument(publicTypeIndexUrl); 
    const storage = profile.getNodeRef(space.storage);

    const locationGeneralDocUrl = storage + 'public/genlocation.ttl';   
    const locationGeneralDoc = createDocument(locationGeneralDocUrl);

    await locationGeneralDoc.save();

    const typeRegistration = publicTypeIndex.addSubject();
    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationGeneralDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await publicTypeIndex.save([ typeRegistration]);

    const newLocation = await locationGeneralDoc.addSubject();

    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
    newLocation.addLiteral(schema.latitude, location.latitude.toFixed(3));
    newLocation.addLiteral(schema.longitude, location.longitude.toFixed(3));
    const success = await locationGeneralDoc.save([newLocation]);


    return success;
}

//Code below taken and modified from https://vincenttunru.gitlab.io/tripledoc/docs/writing-a-solid-app
async function initialiseLocationList(profile, typeIndex) {
    console.log("in initialize");
    const storage = profile.getNodeRef(space.storage);

    const locationDetailDocUrl = storage + 'public/detaillocation.ttl';
    const locationApproxDocUrl = storage + 'public/approxlocation.ttl';
    const locationGeneralDocUrl = storage + 'public/generallocation.ttl';

    //Create the new document
    const locationDetailDoc = createDocument(locationDetailDocUrl);
    const locationApproxDoc = createDocument(locationApproxDocUrl);
    const locationGeneralDoc = createDocument(locationGeneralDocUrl);
    await locationDetailDoc.save();
    await locationApproxDoc.save();
    await locationGeneralDoc.save();

    //Store a reference to that document in the public Type Index;
    const typeRegistration = typeIndex.addSubject();
    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationDetailDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await typeIndex.save([ typeRegistration]);

    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationApproxDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await typeIndex.save([ typeRegistration]);

    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationGeneralDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await typeIndex.save([ typeRegistration]);

    return [ locationDetailDoc, locationApproxDoc, locationGeneralDoc ];
}

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
    //Because I am adding them I shouldn't need to do this....
    if (locationListEntry === null) {
       //return initialiseLocationList(profile, publicTypeIndex);
    }
    //need a way to make sure for instance that this entry 1 is detail.
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

    //These create the needed documents  only want to do this once
    //so need to put in a check to see if they are already there...
    //var detailDoc = await createLocationDetailDoc(user);
    //var approxDoc = await createLocationApproxDoc(user);
    //var generalDoc = await createLocationGeneralDoc(user);
    var locationDoc = await getLocationDoc(user);
    console.log("getData LocationDoc " + JSON.stringify(locationDoc));

    const location = await locationDoc.getSubject();
    latitude = location.getLiteral(schema.latitude); 
    longitude = location.getLiteral(schema.longitude); 
    
   
    return {latitude: {latitude}, longitude: {longitude}};
} 


 const UpdateLocation = ({ ToastManager }) => {
    const webId = useWebId();

     if (webId !== undefined) {
        var CUPurl = webId;
        var data = getData(CUPurl);
    } else {
        //Not fetched yet.
        const isLoading = true;
    }
    
    const coolImage = '';
    const isLoading = false;
        return (
            <UpdateLocationWrapper data-testid="restaurant-component">
                <UpdateLocationContainer>
                    {webId && (
                        <Fragment>
                            <Header>
                            </Header>
                        <UpdateLocationContent
                            webId={CUPurl}
                            image={coolImage}
                            isLoading={isLoading}
                        />
                        </Fragment>

                    )}
                </UpdateLocationContainer>
            </UpdateLocationWrapper>
        );
    
};

export default withToastManager(UpdateLocation);
