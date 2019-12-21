
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportIcon from '@material-ui/icons/Report';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import Tooltip from '@material-ui/core/Tooltip';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

import L from 'leaflet';

import DelaContext from '../context/dela-context';
import ConfirmRevokeDialog from './ConfirmRevokeDialog';

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 150,
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5)
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },

  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
  typography: {
    textAlign: "left",
  },
  content: {
    paddingTop:1,
    "&:last-child": {
      paddingBottom: 3
    }
  },

}));

export default function ParcelDetails(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);

  const context = useContext(DelaContext);

  /**
   * @dev Events handlers 
   */

  const handleUpdateParcelClick = (e) => {
    context.setParcelToUpdate(props.parcel);
    context.setUpdateMode(true);
    context.openManageParcelDialog(true);
  }

  const handleManageParcelMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleZoomInClick =(e) => {
    context.mainMapReference.leafletElement.setView(props.parcel.latlng, 15);
  }

  const handleZoomToContentClick =(e) => {
    var markersBounds = L.latLngBounds();
    var markersCount = 0;
    context.mainMapReference.leafletElement.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        markersBounds.extend(layer.getLatLng());
        markersCount += 1;
      }
    });

    if (markersCount > 1)     
      context.mainMapReference.leafletElement.fitBounds(markersBounds);
    else
      context.mainMapReference.leafletElement.setView(props.parcel.latlng, 15);

  }

  const menuId = 'primary-manage-parcel-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {props.owner ?
        <div>
          <MenuItem onClick={handleUpdateParcelClick}>
            <ListItemIcon>
              <AutorenewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Update" />
          </MenuItem>
          <MenuItem onClick={() => setOpenConfirmDialog(true)}>
            <ListItemIcon>
              <DeleteForeverIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Revoke" />
          </MenuItem>
        </div>
        :
        <div>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <AddShoppingCartIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Bid" />
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <ReportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Dispute" />
          </MenuItem>
        </div>
      }
    </Menu>
  );

  return (
    <div>
      <Card className={classes.card}>
        <CardHeader
          avatar={props.owner ?
            <Avatar aria-label="owner" className={classes.purpleAvatar}>
              O
            </Avatar>
              :
            <Avatar aria-label="laker" className={classes.orangeAvatar}>
                NO
            </Avatar>
            }
          action={
            <IconButton aria-label="settings" onClick={handleManageParcelMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          }          
          title={props.parcel.lbl}
          subheader={props.parcel.cadastralType === 1 ?
            <span>BUILDING</span>
            :
            <span>PARCEL</span>
          }
        />
        {/* <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      /> */}
        <CardContent className={classes.content}>
        <Typography className={classes.typography}> Land Use : {props.parcel.parcelLandUseCode}</Typography>
        <Typography className={classes.typography}> Area : {props.parcel.area} </Typography>
        </CardContent>
        {props.expansion &&
        <div>
          <CardActions disableSpacing>
            <div className={classes.menu}>
              <Tooltip title="Zoom in" onClick={handleZoomInClick}>
                <IconButton aria-label="zoomin">
                  <ZoomInIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom to content" >
                <IconButton aria-label="zoomcontent" onClick={handleZoomToContentClick}>
                  <ZoomOutMapIcon />
                </IconButton>
              </Tooltip>
            </div>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>

          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent className={classes.content}>
            <Typography className={classes.typography}> Address : {props.parcel.addr}</Typography>
            </CardContent>
          </Collapse>
        </div>
      }
      </Card>
      <ConfirmRevokeDialog open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        parcel={props.parcel}
      />
      {renderMenu}
    </div>
  );
}
