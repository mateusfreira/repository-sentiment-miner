import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

/* UI Components */
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const HeaderOptions = () => (
  <OptionsContainer>
    <Option to="/">
      <Button label="Home" />
    </Option>
    <Option to="config">
      <Button label="Configuration" />
    </Option>
    <Option to="add">
      <Button label="Add Project" />
    </Option>
  </OptionsContainer>
);

const Title = () => (
  <StyledTitle>
    <Link to="/">Repository Sentiment Miner</Link>
  </StyledTitle>
);

const Header = () => (
  <AppBar title={<Title />} showMenuIconButton={false}>
    <HeaderOptions />
  </AppBar>
);

const Option = styled(Link)`
  text-decoration: none;

  &:visited {
    color: #fafafa;
  }
`;

const Button = styled(FlatButton)`
  color: #fafafa !important;
`;

const OptionsContainer = styled.div`
  margin: auto 0;
`;

const StyledTitle = styled.div`
  width: 100%;
  text-align: left;
  cursor: pointer;

  > a {
    text-decoration: none;
  }

  > a:visited {
    color: #fafafa;
  }
`;

export default Header;
