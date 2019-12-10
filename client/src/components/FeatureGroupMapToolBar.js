import React from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';


export default function FeatureGroupMapToolBar(props) {

    const _onCreated = (e) => {
        props.onChange(e.layer.toGeoJSON());
    }

    return (
        <FeatureGroup>
            <EditControl
                position='bottomright'
                onCreated={_onCreated}
                // onEdited={_onEditPath}
                // onDeleted={_onDeleted}
                draw={{
                    rectangle: false,
                    circle:false,
                    circlemarker:false,
                    polyline:false,
                }}

                edit={{
                    edit: false,
                    remove: false
                }}
            />
            
        </FeatureGroup>
    );
}