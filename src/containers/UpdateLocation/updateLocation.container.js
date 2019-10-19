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



async function createLocationDetailDoc(profile) {

    var location = {latitude: 41.9185819, longitude: 12.51433};
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

    var location = {latitude: 41.9185819, longitude: 12.51433};

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
async function createLocationGeneralDoc(profile) {

     var location = {latitude: 41.9185819, longitude: 12.51433};
    
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
    //var locationDoc = await getLocationDoc(user);
    //console.log("getData LocationDoc " + JSON.stringify(locationDoc));

    //const location = await locationDoc.getSubject();
   // latitude = location.getLiteral(schema.latitude); 
   // longitude = location.getLiteral(schema.longitude); 
    
   
    return null;
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
