import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";

import { Router } from "../lib/routes";

const styles = {
  flex: {
    flex: 1,
  },
};

interface IProps {
  isAuthenticated: boolean;
}

type Props = IProps & WithStyles<typeof styles>;

interface IState {
  openAccountMenu?: HTMLElement;
}

const APP_BAR_DATA = gql`
  query AppBarData {
    user {
      username
    }
  }
`;

class CondorAppBar extends React.Component<Props, IState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openAccountMenu: null,
    };
  }
  public render() {
    const { classes, isAuthenticated } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Condor Club
          </Typography>
          {isAuthenticated ? (
            <div>
              <IconButton
                aria-owns={"menu-appbar"}
                aria-haspopup="true"
                onClick={this.handleAccountMenu}
                color="inherit"
                id="accountButton"
              >
                <AccountCircle />
              </IconButton>
              {this.state.openAccountMenu ? (
                <Query query={APP_BAR_DATA} id="query">
                  {({ data }) => {
                    return data && data.user ? (
                      <Menu
                        id="menu-appbar"
                        anchorEl={this.state.openAccountMenu}
                        anchorOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        transformOrigin={{
                          horizontal: "right",
                          vertical: "top",
                        }}
                        open={true}
                        onClose={() =>
                          this.setState(() => ({ openAccountMenu: null }))
                        }
                      >
                        <MenuItem>
                          Hey,{" "}
                          {data.user.username
                            ? data.user.username
                            : "Anonymous"}
                        </MenuItem>
                        <MenuItem id="logout" onClick={this.logout}>
                          Sign Out
                        </MenuItem>
                      </Menu>
                    ) : null;
                  }}
                </Query>
              ) : null}
            </div>
          ) : (
            <Button id="login" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    );
  }
  private handleAccountMenu = (event: React.SyntheticEvent<HTMLElement>) => {
    const target = event.currentTarget;
    this.setState(() => ({
      openAccountMenu: target,
    }));
  };
  private logout = () => {
    Router.pushRoute("/auth/sign-out");
  };
}

export default withStyles(styles)(CondorAppBar);
