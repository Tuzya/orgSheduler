import React, { useState } from 'react';
import { Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

export default function MobileDrawer({ logOutHandler }) {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <div>
      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <List onClick={() => setOpenDrawer(false)}>
          <ListItem>
            <ListItemText>
              <Link to="/">Groups(Home)</Link>
            </ListItemText>
          </ListItem>

          <ListItem>
            <ListItemText>
              <Link to="/groups/new">New Group</Link>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Link to="/groups/schema">Schema</Link>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Link to="/students">Students</Link>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Link to="/students/new">New Students</Link>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Link to="/" onClick={logOutHandler}>
                Logout
              </Link>
            </ListItemText>
          </ListItem>
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer((openDrawer) => !openDrawer)}>
        <MenuIcon sx={{ color: 'white', fontSize: '30px' }} />
      </IconButton>
    </div>
  );
}
