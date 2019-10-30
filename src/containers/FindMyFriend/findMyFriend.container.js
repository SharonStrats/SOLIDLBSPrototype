import React, { Fragment } from 'react';
import { withToastManager } from 'react-toast-notifications';
import { useWebId } from '@inrupt/solid-react-components';
import {
    Header,
    FindMyFriendContainer,
    FindMyFriendWrapper
} from './findMyFriend.style';
import { foaf } from 'rdf-namespaces';
import { fetchDocument } from 'tripledoc';
import FindMyFriendContent from './findMyFriend.component';


const getData = async webId => {
    // loading new events
    const webIdDoc = await fetchDocument(webId);
    /* 2. Read the Subject representing the current user: */
    const user = webIdDoc.getSubject(webId);
    /* 3. Get their foaf:name: */
    var name = user.getLiteral(foaf.name);
   
   return null;
} 

 const FindMyFriendSearch = ({ ToastManager }) => {
    const isLoading = false;
    const webId = useWebId();
     if (webId !== undefined) {
        var data = getData(webId);

    } else {
        //Not fetched yet.
        const isLoading = true;
    }
    
    const coolImage = '';

        return (
            <FindMyFriendWrapper data-testid="findmyfriend-component">
                <FindMyFriendContainer>
                    {webId && (
                        <Fragment>
                            <Header>
                            </Header>
                        <FindMyFriendContent
                            webId={webId}
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
