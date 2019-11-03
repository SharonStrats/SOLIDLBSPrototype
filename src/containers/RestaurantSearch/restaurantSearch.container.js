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
import { foaf } from 'rdf-namespaces';




const getData = async webId => {

    try { 
        const webIdDoc = await fetchDocument(webId);
        /* 2. Read the Subject representing the current user: */
        const user = webIdDoc.getSubject(webId);
        /* 3. Get their foaf:name: */
        return user.getLiteral(foaf.name);
    } catch (err) {
        console.log(err);
    }

} 


 const RestaurantSearch = ({ ToastManager }) => {

    const webId = useWebId();
 
     if (webId !== undefined) {
        var data = getData(webId);
    } 
    
        return (
            <RestaurantSearchWrapper data-testid="restaurant-component">
                <RestaurantSearchContainer>
                    {webId && (
                        <Fragment>
                            <Header>
                            </Header>
                        <RestaurantSearchContent
                            name={data}
                            webId={webId}
                        />
                        </Fragment>

                    )}
                </RestaurantSearchContainer>
            </RestaurantSearchWrapper>
        );
    
};

export default withToastManager(RestaurantSearch);
