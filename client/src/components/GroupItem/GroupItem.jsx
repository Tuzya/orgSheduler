import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import ListItemAvatar from '@mui/material/ListItemAvatar/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import EditIcon from '@mui/icons-material/Edit';
import PetsIcon from '@mui/icons-material/Pets';
import InfoIcon from '@mui/icons-material/Info';

function GroupItem({
  groupPage,
  name,
  phase,
  people = [],
  groupType,
  isAuth,
  codeReviewDays,
  createdAt
}) {
  return (
    <ListItem divider={true}>
      {' '}
      <ListItemAvatar>
        <Avatar>
          <PetsIcon />
        </Avatar>
      </ListItemAvatar>
      <Link to={groupPage}>
        <ListItemText
          primaryTypographyProps={{ style: { fontSize: '1.2rem' } }}
          primary={name}
          secondaryTypographyProps={{ style: { fontSize: '1rem' } }}
          secondary={`${groupType}. ${isAuth ? dayjs(createdAt).format('DD.MM.') : ''}  
          Фаза: ${phase}. Студентов: ${people.length}. 
          ${codeReviewDays.length ? 'Дни\u00A0кодревью:' + codeReviewDays : ''}`}
          title={people.join('\n')}
        />
      </Link>
      <ListItemSecondaryAction>
        {isAuth ? (
          <Link to={`${groupPage}/edit`}>
            <IconButton edge="end" aria-label="edit">
              <EditIcon />
            </IconButton>
          </Link>
        ) : (
          <Link to={groupPage}>
            <IconButton edge="end" aria-label="edit">
              <InfoIcon sx={{ fontSize: '33px' }} />
            </IconButton>
          </Link>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
}

GroupItem.propTypes = {
  groupPage: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  phase: PropTypes.number.isRequired,
  people: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default GroupItem;
