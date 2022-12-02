import React from 'react';
import styled from "@mui/material/styles/styled";
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import MobileDrawer from './MobileDrawer';
import logo from '../components/Header/elb-logo.svg';
import { useDispatch } from 'react-redux';
import { logout } from '../store/auth/actions';

function Navbar({ isAuth }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const logOutHandler = (e) => dispatch(logout(e));
  return (
    <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <Logo variant="h5">
          <Link to="/">
            <UserBox>
              <Img src={logo} alt="" />
              <div>Groups Scheduler</div>
            </UserBox>
          </Link>
        </Logo>
        {isMobile && isAuth ? (
          <MobileDrawer logOutHandler={logOutHandler} />
        ) : (
          <div>
            {isAuth ? (
              <>
                <StyledLink to="/">Groups</StyledLink>
                <StyledLink to="/groups/new">New Group</StyledLink>
                <StyledLink to="/groups/schema">Schema</StyledLink>
                <StyledLink to="/students">Students</StyledLink>
                <StyledLink to="/students/new">New Students</StyledLink>
                <StyledLink to="/" onClick={logOutHandler}>
                  Logout
                </StyledLink>
              </>
            ) : (
              <StyledLink to="/login">Login</StyledLink>
            )}
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;

const Logo = styled(Typography)({
  flexGrow: '1',
  cursor: 'pointer'
});

const Img = styled('img')({
  height: '50px',
  marginRight: '1rem'
});

const UserBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  magrin: '20px',
  color: 'white'
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: 'white',
  marginLeft: theme.spacing(2),
  transition: '0.2s',
  '&:hover': {
    opacity: '0.7'
  }
}));
