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

function GroupItem({ link, name, phase, people = [], groupType, isAuth, codeReviewDays }) {
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
          primaryTypographyProps={{ style: {  fontSize: '1.2rem' } }}
          primary={name}
          secondaryTypographyProps={{ style: { fontSize: '1rem' } }}
          secondary={`${groupType}. Фаза: ${phase}. Студентов: ${people.length}. ${
            codeReviewDays.length ? 'Дни\u00A0кодревью:' + codeReviewDays : ''
          }`}
          title={people.join('\n')}
        />
      </Link>
      <ListItemSecondaryAction>
        {isAuth ? (
          <Link to={`${link}/edit`}>
            <IconButton edge="end" aria-label="edit">
              <EditIcon />
            </IconButton>
          </Link>
        ) : (
          <Link to={link}>
            <IconButton edge="end" aria-label="edit">
              <InfoIcon sx={{  fontSize: '33px' }}/>
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
