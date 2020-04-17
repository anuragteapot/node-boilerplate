import React, { useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import { mainListItems, adminListItems, secondaryListItems } from "./listItems";
import Orders from "./Orders";
import api from "../api";
import { useHistory } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListSubheader from "@material-ui/core/ListSubheader";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  const history = useHistory();
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isGate, setIsGate] = React.useState(false);
  const [action, setAction] = React.useState();
  const [isSecurity, setIsSecurity] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const types = {
    RAISED: "RAISED",
    APPROVED: "APPROVED",
    CHECKED: "CHECKED",
    GATE_INCHARGE: "GATE_INCHARGE",
    REJECT: "REJECT",
    CANCEL: "CANCEL",
  };

  const logout = async () => {
    try {
      await api.LOGOUT();
    } catch (e) {
      console.log(e);
    }
    localStorage.removeItem("$token");
    localStorage.removeItem("$user");
    history.push("/signin");
  };


  const handleSearch = async (value) => {
    await fetchData(50, action, value);
  };

  const fetchData = async (limit = 10, act, filter = "") => {
    let data = {
      data: [],
    };

    if (act === "RAISED") {
      data = await api.GET_ALL_PASS(types.RAISED, limit, filter);
    } else if (act === "APPROVED") {
      data = await api.GET_ALL_PASS(types.APPROVED, limit, filter);
    } else if (act === "CHECKED") {
      data = await api.GET_ALL_PASS(types.CHECKED, limit, filter);
    } else if (act === "REJECT") {
      data = await api.GET_ALL_PASS(types.REJECT, limit, filter);
    } else if (act === types.GATE_INCHARGE) {
      data = await api.GET_ALL_PASS(types.GATE_INCHARGE, limit, filter);
    } else {
      data = await api.GET_ALL_PASS(types.RAISED, limit, filter, "MY");
    }

    setData(data.data);
  };

  const type = new URLSearchParams(props.location.search).get("type");
  const act = new URLSearchParams(props.location.search).get("action");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await api.GET_USER();
      localStorage.setItem("$user", JSON.stringify(user.data));

      if (user && user.data.acl.indexOf("$admin") !== -1) {
        setIsAdmin(true);
      }

      if (user && user.data.acl.indexOf("$security") !== -1) {
        setIsSecurity(true);
      }

      if (user && user.data.acl.indexOf("$gate") !== -1) {
        setIsGate(true);
      }
      setAction(act);
      await fetchData(10, act);
    };
    if (!localStorage.getItem("$token")) {
      history.push("/");
    } else {
      fetchUser();
    }
  }, [type, act]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Dashboard
          </Typography>
          <Button variant="contained" color="secondary" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{isAdmin ? adminListItems : mainListItems}</List>

        {isAdmin || isSecurity || isGate ? (
          <div>
            <Divider />
            <ListSubheader inset>Need Action</ListSubheader>
          </div>
        ) : (
          ""
        )}
        <List>
          {isAdmin ? (
            <Link href="/dashboard?action=RAISED">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Raised" />
              </ListItem>
            </Link>
          ) : (
            ""
          )}
          {isSecurity ? (
            <Link href="/dashboard?action=APPROVED">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Approved" />
              </ListItem>
            </Link>
          ) : (
            ""
          )}
          {isGate ? (
            <Link href="/dashboard?action=CHECKED">
              <ListItem button>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Checked" />
              </ListItem>
            </Link>
          ) : (
            ""
          )}
          {<Divider />}
          {isAdmin || isSecurity || isGate ? secondaryListItems : ""}
          <Divider></Divider>
          <ListSubheader inset>My Pass</ListSubheader>
          <Link href="/dashboard?action=MY">
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="My Pass" />
            </ListItem>
          </Link>
        </List>
      </Drawer>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Orders
                action={action}
                data={data}
                handleSearch={handleSearch}
                fetchData={fetchData}
              />
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}
