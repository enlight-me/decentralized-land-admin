import React, { createRef } from 'react';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';


export default function FeatureGroupMapToolBar(props) {

    const editFG = createRef();

    const _onCreated = (e) => {
        const fg = editFG.current;
        props.onChange(e.layer.toGeoJSON());
        if (fg != null) fg.layerContainer.removeLayer(e.layer);
    }

    return (
        <FeatureGroup ref={editFG}>
            <EditControl
                position='topright'
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