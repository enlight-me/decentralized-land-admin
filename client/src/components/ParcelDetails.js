
import React from 'react';
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
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ReportIcon from '@material-ui/icons/Report';
import Tooltip from '@material-ui/core/Tooltip';

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
    padding: "0.2",
  }

}));

export default function ParcelDetails(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
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
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.parcel.lbl}
        subheader={props.parcel.parcelType}
      />
      {/* <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      /> */}
      <CardContent className={classes.content}>
        <Typography className={classes.typography}> Address : {props.parcel.addr}</Typography>
      </CardContent>

      <CardActions disableSpacing>
        {props.owner ?
          <div>
            <Tooltip title="Update">
              <IconButton aria-label="update">
                <DynamicFeedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Revoke">
              <IconButton aria-label="revoke">
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </div>
          :
          <Tooltip title="Dispute">
            <IconButton aria-label="dispute">
              <ReportIcon />
            </IconButton>
          </Tooltip>
        }
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
          <Typography className={classes.typography}> Area : {props.parcel.area}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
