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



async function getData(CUPurl) {
    // loading new events
    let query = '';
    const user = data[CUPurl];
    const nameLd = await user.name;
    console.log(user);

} 


/**
 * We are using ldflex to fetch profile data from a solid pod.
 * ldflex libary is using json-LD for this reason you will see async calls
 * when we want to get a field value, why ? becuase they are expanded the data
 * this means the result will have a better format to read on Javascript.
 * for more information please go to: https://github.com/solid/query-ldflex
 */
 const RestaurantSearch = ({ ToastManager }) => {
   
    //                       webId={this.props.webId}
   
    const webId = useWebId();
    console.log(webId);
    //console.log(props.city.toString())
    if (webId !== undefined) {
        //var CUPurl = webId.replace('profile/card#me', '') + 'private/events#';
        var CUPurl = webId;
    }
    getData(CUPurl);
    const image = '';
    const isLoading = false;
    const name = 'sharon';
    const selectedDate = null;
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
                            selectedDate={selectedDate}
                        />
                        </Fragment>

                    )}
                </RestaurantSearchContainer>
            </RestaurantSearchWrapper>
        );
    
};

export default withToastManager(RestaurantSearch);
