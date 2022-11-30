import React from "react";

import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import PetsIcon from '@mui/icons-material/Pets';
import EditIcon from '@mui/icons-material/Edit';
import {Link} from "react-router-dom"



export default function ListComponent() {
  return (
    <Grid item xs={12} md={6}>
      <div >
        <List>
              <ListItem> {/* Single list item */}
                <ListItemAvatar>
                  <Avatar>
                    <PetsIcon />
                  </Avatar>
                </ListItemAvatar>
                <Link to={'/'}>
                <ListItemText
                  primary="GFG Self-Paced Course"
                  secondary="Structured premium video lectures"
                />
                </Link>
                <ListItemSecondaryAction>

                  <IconButton edge="end" aria-label="delete">
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PetsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Placement Preparation Course"
                  secondary="An interview-centric course designed to prepare you for the role of SDE"

                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PetsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Live Course"
                  secondary = "Real Time Live Classes accessible from home"


                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>

      </div>
    </Grid>
  );
}
