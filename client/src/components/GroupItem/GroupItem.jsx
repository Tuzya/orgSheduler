import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ListItemAvatar from '@mui/material/ListItemAvatar/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import EditIcon from '@mui/icons-material/Edit';
import PetsIcon from '@mui/icons-material/Pets';
import InfoIcon from '@mui/icons-material/Info';

function GroupItem({ link, name, phase, people = [], groupType, isAuth }) {
  return (
    <ListItem divider={true}>
      {' '}
      <ListItemAvatar>
        <Avatar>
          <PetsIcon />
        </Avatar>
      </ListItemAvatar>
      <Link to={link}>
        <ListItemText
          primary={name}
          secondary={`${groupType}. Фаза: ${phase}. Студентов: ${people.length}.`}
          title={people.join("\n")}
        />
      </Link>
      <ListItemSecondaryAction>
        {isAuth ? (
          <Link to={`${link}/edit`}>
          <IconButton edge="end" aria-label="edit" >
            <EditIcon />
          </IconButton>
          </Link>
        ) : (
          <Link to={link}>
          <IconButton edge="end" aria-label="edit" >
          <InfoIcon />
          </IconButton>
          </Link>
          )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

GroupItem.propTypes = {
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired,
  people: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default GroupItem;

{
  /*<div className="collection-item">*/
}
{
  /*  <Link to={link}>{name}</Link>*/
}
{
  /*  <span className="badge" title={people.join("\n")}>*/
}
{
  /*        {`${groupType}. Фаза: ${phase}. Студентов: ${people.length}.`}*/
}
{
  /*    <span>*/
}
{
  /*          {isAuth && (*/
}
{
  /*            <i className="material-icons" style={styles.icon}>*/
}
{
  /*              <Link to={`${link}/edit`}>edit</Link>*/
}
{
  /*            </i>*/
}
{
  /*          )}*/
}
{
  /*        </span>*/
}
{
  /*      </span>*/
}
{
  /*</div>*/
}
