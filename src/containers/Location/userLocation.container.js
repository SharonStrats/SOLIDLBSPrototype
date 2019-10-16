import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withToastManager } from 'react-toast-notifications';
import { useWebId, ShexFormBuilder } from '@inrupt/solid-react-components';
import {
    Header,
    UserLocationContainer,
    UserLocationWrapper,
    ShexForm,
    AutoSaveNotification,
    WebId,
} from './userLocation.style';
import LocationContent from './userLocation.component';
//import { Image } from './components';

//const defaultProfilePhoto = '/img/icon/empty-profile.svg';


/**
 * We are using ldflex to fetch profile data from a solid pod.
 * ldflex libary is using json-LD for this reason you will see async calls
 * when we want to get a field value, why ? becuase they are expanded the data
 * this means the result will have a better format to read on Javascript.
 * for more information please go to: https://github.com/solid/query-ldflex
 */

const LoadLocation = ({ toastManager }) => {
    const webId = useWebId();
    const { t, i18n } = useTranslation();

    onSearchSubmit2('test');
    
    return (
        <UserLocationWrapper data-testid="userLocation-component">
            <UserLocationContainer>
                {webId && (
                    <Fragment>
                        <Header>
                            <Image
                                {...{
                                    webId,
                                    defaultProfilePhoto,
                                    toastManager,
                                }}
                            />
                        </Header>
                        <LocationContent
                            latitude={latitude}
                            longitude={longitude}
                            name={name}
                            isLoading={isLoading}
                        />

                 </Fragment>
                )}
            </UserLocationContainer>
        </UserLocationWrapper>
    );
};

export default withToastManager(LoadLocation);
