import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

/* UI Components */
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const HeaderOptions = () => (
  <StyledHeader>
    <h2>
      <Option to="/"> Home </Option> |
      <Option to="config"> Config </Option> |
      <Option to="add"> Add </Option> |
    </h2>
  </StyledHeader>
);

const Header = () => (
  <AppBar
    title={<span>Commits miner</span>}
    iconElementRight={<HeaderOptions />}
    showMenuIconButton={false}
  />
);

const StyledHeader = styled.span`
  color: white;

  > h1 {
    font-size: 1.5em;
  }
`;

const Option = styled(Link)`
  text-decoration: none;
`;

export default Header;
