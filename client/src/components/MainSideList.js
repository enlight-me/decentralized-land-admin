import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';

export default function MainSideList(props) {

    function handleMapClick(event){
        props.closeDrawer();

    }

    return (
            <List>               
                <ListItem button key='Map' 
                onClick={event => handleMapClick(event)}
                >
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary='Map'/>
                </ListItem>
                <ListItem button key='Dashboard'>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary='Dashboard'/>
                </ListItem>

                <Divider />
                {['Application', 'Property', 'Document', 'Party'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon><InboxIcon /></ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
    );
}