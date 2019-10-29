import React from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';

import MainSideList from './MainSideList';

export default function MainDrawer(props) {
    
    return (

        <SwipeableDrawer          
            open={props.drawerOpen}
            onClose={props.closeDrawer}
            onOpen={props.openDrawer}
        >            
            <MainSideList
                onClick={props.closeDrawer}
                onKeyDown={props.closeDrawer}
                closeDrawer = {props.closeDrawer}
            />
        </SwipeableDrawer>
    );
}
