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

async function addLocation(profile, location, locationList) {

    const newLocation = await locationList.addSubject();
    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
    newLocation.addLiteral(schema.latitude, location.latitude);
    newLocation.addLiteral(schema.longitude, location.longitude);
    const success = await locationList.save([newLocation]);
    return success;

}


async function createLocationDetailDoc(profile,location) {

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

async function createLocationApproxDoc(profile, location) {

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
    newLocation.addLiteral(schema.latitude, location.latitude.toFixed(3));
    newLocation.addLiteral(schema.longitude, location.longitude.toFixed(3));
    const success = await locationApproxDoc.save([newLocation]);


    return success;
}
async function createLocationGeneralDoc(profile, location) {

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
    newLocation.addLiteral(schema.latitude, location.latitude.toFixed(1));
    newLocation.addLiteral(schema.longitude, location.longitude.toFixed(1));
    const success = await locationGeneralDoc.save([newLocation]);


    return success;
}




//Code below taken and modified from https://vincenttunru.gitlab.io/tripledoc/docs/writing-a-solid-app
async function initialiseLocationList(profile, typeIndex) {
    console.log("in initialize");
    var location = {latitude: 25.6945173,longitude: 100.1590505};
    const storage = profile.getNodeRef(space.storage);

    const locationDetailDocUrl = storage + 'public/detaillocation.ttl';
    //const locationApproxDocUrl = storage + 'public/approxlocation.ttl';
   // const locationGeneralDocUrl = storage + 'public/generallocation.ttl';

    //Create the new document
    const locationDetailDoc = createDocument(locationDetailDocUrl);
    //const locationApproxDoc = createDocument(locationApproxDocUrl);
    //const locationGeneralDoc = createDocument(locationGeneralDocUrl);
    await locationDetailDoc.save();
   // await locationApproxDoc.save();
   // await locationGeneralDoc.save();

    //Store a reference to that document in the public Type Index;
    const typeRegistration = typeIndex.addSubject();
    typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
    typeRegistration.addNodeRef(solid.instance, locationDetailDoc.asNodeRef())
    typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
    await typeIndex.save([ typeRegistration]);

    const newLocation = await locationDetailDoc.addSubject();

    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
    newLocation.addLiteral(schema.latitude, location.latitude);
    newLocation.addLiteral(schema.longitude, location.longitude);
    const success = await locationDetailDoc.save([newLocation]);


    //These create the needed documents
    //var detailDoc = await createLocationDetailDoc(user);
    var approxDoc = await createLocationApproxDoc(profile, location);
    var generalDoc = await createLocationGeneralDoc(profile, location);

    return  success;
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
    const locationListEntries = publicTypeIndex.findSubjects(solid.forClass, schema.GeoCoordinates)
    console.log("Location Entries" + locationListEntries);
    //First time someone logs in
    if (locationListEntries.length < 0) {
    // the array is defined and has at least one element
       return initialiseLocationList(profile, publicTypeIndex);
    }
    //need a way to make sure for instance that this entry 1 is detail.
    //Add a new location before retrieving..  tricking part is adding to 
    //each location entry detail, approx and general...  
    //Need to think about how to check each one...
    //Also if I am in updateLocation then it's my POD..

    try { //Detail
        var locationListUrl = await locationListEntries[0].getNodeRef(solid.instance);
        var locationDoc =  await fetchDocument(locationListUrl);
    } catch (err) {
        console.log(err);
        try {  //Approximate
            locationListUrl = await locationListEntries[1].getNodeRef(solid.instance);
            return await fetchDocument(locationListUrl);
        } catch (err) {
            console.log(err);
            try { //General
                locationListUrl = await locationListEntries[2].getNodeRef(solid.instance);
                return await fetchDocument(locationListUrl);
            } catch (err) {
                console.log(err);
            }
        }
    }

    return locationDoc; // use null then to check that they do not have location services available
}
const getData = async webId => {
    const webIdDoc = await fetchDocument(webId);
    /* 2. Read the Subject representing the current user: */
    const user = webIdDoc.getSubject(webId);
    /* 3. Get their foaf:name: */
    var name = user.getLiteral(foaf.name);
   
    var locationDoc = await getLocationDoc(user);
  //  return name;
} 


 const UpdateLocation = ({ ToastManager }) => {
    const webId = useWebId();

     if (webId !== undefined) {
        var CUPurl = webId;
        getData(CUPurl);
    } else {
        //Not fetched yet.
        const isLoading = true;
    }
    
    const image = '';
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
                            image={image}
                            isLoading={isLoading}
                        />
                        </Fragment>

                    )}
                </UpdateLocationContainer>
            </UpdateLocationWrapper>
        );
    
};

export default withToastManager(UpdateLocation);
