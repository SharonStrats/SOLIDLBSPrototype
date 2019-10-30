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
import { fetchDocument, createDocument } from 'tripledoc';
import { solid, foaf, schema, space, rdf } from 'rdf-namespaces';

//NEED TO ASK PERMISSION TO ADD LOCATION....
//Got the getCurrentPosition async/await from 
//https://blog.larapulse.com/es-2015/synchronous-fetch-browser-geolocation
function getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

function getPermission() {  
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        return result.state;
    }); 
} 

const fetchCoordinates = async () => {
    //var permission = getPermission();
    var permission = "granted";
    if (permission === "granted") { 
        try {
            const { coords } = await getCurrentPosition();
            const { latitude, longitude } = coords;
            return {latitude: latitude, longitude: longitude};
            // Handle coordinates
        } catch (error) {
            // Handle error
            console.error(error);
        }
    }

};

async function addLocation(location, locationList) {
    try { 
        const newLocation = await locationList.addSubject();
    
        newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
        newLocation.addLiteral(schema.latitude, location.latitude);
        newLocation.addLiteral(schema.longitude, location.longitude);
        try { 
            return await locationList.save([newLocation]);
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }

}


async function createLocationDetailDoc(profile,location) {

    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    try { 
        const publicTypeIndex = await fetchDocument(publicTypeIndexUrl); 
        const storage = profile.getNodeRef(space.storage);

        const locationDetailDocUrl = storage + 'public/detaillocation.ttl';   
        const locationDetailDoc = createDocument(locationDetailDocUrl);
        try { 
            await locationDetailDoc.save();

            const typeRegistration = publicTypeIndex.addSubject();
            typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
            typeRegistration.addNodeRef(solid.instance, locationDetailDoc.asNodeRef())
            typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
            try { 
                await publicTypeIndex.save([ typeRegistration]);

                try { 
                    const newLocation = await locationDetailDoc.addSubject();

                    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
                    newLocation.addLiteral(schema.latitude, location.latitude);
                    newLocation.addLiteral(schema.longitude, location.longitude);
                    try { 
                        return await locationDetailDoc.save([newLocation]);
                    } catch (err) {
                        console.log(err);
                    }
                } catch (err) {
                    console.log(err);
                }

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

async function createLocationApproxDoc(profile, location) {

    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    try { 
        const publicTypeIndex = await fetchDocument(publicTypeIndexUrl); 
        const storage = profile.getNodeRef(space.storage);

        const locationApproxDocUrl = storage + 'public/approxlocation.ttl';   
        const locationApproxDoc = createDocument(locationApproxDocUrl);
        try { 
            await locationApproxDoc.save();

            const typeRegistration = publicTypeIndex.addSubject();
            typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
            typeRegistration.addNodeRef(solid.instance, locationApproxDoc.asNodeRef())
            typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
            try { 
                await publicTypeIndex.save([ typeRegistration]);
                try { 
                    const newLocation = await locationApproxDoc.addSubject();

                    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
                    newLocation.addLiteral(schema.latitude, location.latitude.toFixed(3));
                    newLocation.addLiteral(schema.longitude, location.longitude.toFixed(3));
                    try { 
                        return await locationApproxDoc.save([newLocation]);
                    } catch (err) {
                        console.log(err);
                    }
                } catch (err) {
                    console.log(err);
                }
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

async function createLocationGeneralDoc(profile, location) {

    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    try { 
        const publicTypeIndex = await fetchDocument(publicTypeIndexUrl); 
        const storage = profile.getNodeRef(space.storage);

        const locationGeneralDocUrl = storage + 'public/genlocation.ttl';   
        const locationGeneralDoc = createDocument(locationGeneralDocUrl);
        try { 
            await locationGeneralDoc.save();

            const typeRegistration = publicTypeIndex.addSubject();
            typeRegistration.addNodeRef(rdf.type, solid.TypeRegistration)
            typeRegistration.addNodeRef(solid.instance, locationGeneralDoc.asNodeRef())
            typeRegistration.addNodeRef(solid.forClass, schema.GeoCoordinates)
            try { 
                await publicTypeIndex.save([ typeRegistration]);
                try { 
                    const newLocation = await locationGeneralDoc.addSubject();

                    newLocation.addNodeRef(rdf.type, schema.GeoCoordinates);
                    newLocation.addLiteral(schema.latitude, location.latitude.toFixed(1));
                    newLocation.addLiteral(schema.longitude, location.longitude.toFixed(1));
                    try { 
                        return await locationGeneralDoc.save([newLocation]);
                    } catch (err) {
                        console.log(err);
                    }
                } catch (err) {
                    console.log(err);
                }
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

//Initialize all location files
async function initialiseLocationList(profile) { 
   
    try {    
        var location = await fetchCoordinates();
    } catch (err)  {
        console.log(err);
    }
    try { 
        await createLocationDetailDoc(profile, location);
    } catch (err) {
        console.log(err);
    }

    try { 
        await createLocationApproxDoc(profile, location);
    } catch (err) {
        console.log(err);
    }

    try { 
        await createLocationGeneralDoc(profile, location);
    } catch (err) {
        console.log(err);
    }
}
async function addLocationDataToDoc(location, locationListEntry) {
    try { 
        var locationListUrl = await locationListEntry.getNodeRef(solid.instance);
        try {     
            var locationDoc =  await fetchDocument(locationListUrl);
            console.log("This is the location doc " + JSON.stringify(locationDoc));
            try {
                await addLocation(location, locationDoc);
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

//Given that the user has access to these files another row of
//recent location data will be loaded.  The user technically
//should have access because it is their POD.
//Also note, right now I know that they end up in this order
//0 array entry detail, 1 = approximate, 2 = general to scale this
//needs to have an additional check or way to determine this by name
async function addLocationDataToAllDocs(location, locationListEntries) {
    //Different location objects are needed so toFixed will work
    var approxLocation = {latitude: "", longitude: ""};
    var genLocation = {latitude: "", longitude: ""};
    if (location !== undefined) { 
        try { //Detail
            await addLocationDataToDoc(location, locationListEntries[0]);
        } catch (err) {
            console.log(err);
        }
        try {  //Approximate
            approxLocation.latitude = location.latitude.toFixed(3);
            approxLocation.longitude = location.longitude.toFixed(3);
            await addLocationDataToDoc(approxLocation, locationListEntries[1]);
        } catch (err) {
            console.log(err);
        }
        try { //General
            genLocation.latitude = location.latitude.toFixed(1);
            genLocation.longitude = location.longitude.toFixed(1);
            await addLocationDataToDoc(genLocation, locationListEntries[2]);
        } catch (err) {
            console.log(err);
        }          
    } else {
        console.log("Location was not found ");
    }
}

//Right now it load all data without regard to permission from user, this is for testing
//Once the data is loaded then the user can go and set specific permissions for the files
async function processLocationData(profile) {
    //First attempt will be making it public, but really
    //want to make it private
    /*  
        Subject            Predicate                Object
        #location          rdf:type                 solid:TypeRegistration
        #location          solid:forClass           schema:GeoCoordinates
        #location          solid:instance           /public/detaillocation.ttl
    */
    const publicTypeIndexUrl = profile.getNodeRef(solid.publicTypeIndex);
    
    try {
        var location = await fetchCoordinates();
    } catch (err) {
        console.log(err);
    }
    try { 
        const publicTypeIndex = await fetchDocument(publicTypeIndexUrl);
        const locationListEntries = publicTypeIndex.findSubjects(solid.forClass, schema.GeoCoordinates)
    

        //if location list has entries just add a new entry
        if (locationListEntries.length > 0) {
            try { 
                return addLocationDataToAllDocs(location,locationListEntries );
            } catch (err) {
                console.log(err);
            } 
        } else {
            return initialiseLocationList(profile, publicTypeIndex);
 
        }    
    } catch (err) {
        console.log(err);
    }
}
const getData = async webId => {
    try { 
        const webIdDoc = await fetchDocument(webId);
        /* 2. Read the Subject representing the current user: */
        const user = webIdDoc.getSubject(webId);
        /* 3. Get their foaf:name: */
       //var name = user.getLiteral(foaf.name);
    
        try {    
            return await processLocationData(user);
        } catch(err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
} 


 const UpdateLocation = ({ ToastManager }) => {
    //var isLoading = false;  will use this later 
    const webId = useWebId();

     if (webId !== undefined) {
        var CUPurl = webId;
        getData(CUPurl);
    } else {
        //Not fetched yet.
        //isLoading = true;
    }
    
    const image = '';
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
                />
                        </Fragment>

                    )}
                </UpdateLocationContainer>
            </UpdateLocationWrapper>
        );
    
};

export default withToastManager(UpdateLocation);
