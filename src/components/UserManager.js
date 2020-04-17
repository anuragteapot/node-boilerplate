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
import api from "../api";
import Table from "./Table";
import { useSnackbar } from "notistack";
import { useHistory } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListSubheader from "@material-ui/core/ListSubheader";
import SelectEmail from "./SelectEmail";

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
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [OData, setOData] = React.useState([]);
  const [aclId, setAclId] = React.useState();
  const [typeName, setTypeName] = React.useState();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isGate, setIsGate] = React.useState(false);
  const [isSecurity, setIsSecurity] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    try {
      if (type === "gateIncharge") {
        await api.ACL("makeGateIncharge", { userId: aclId });
      } else if (type === "admin") {
        await api.ACL("makeAdmin", { userId: aclId });
      } else if (type === "security") {
        await api.ACL("makeSecurity", { userId: aclId });
      }
      enqueueSnackbar("DONE", { variant: "success" });
      await fetchData();
      setAclId(undefined);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const fetchData = async (limit = 10, filter = "") => {
    let users = {
      data: {},
    };

    if (type === "gateIncharge") {
      users = await api.ACL("getAllGateIncharge", {}, limit, filter);
      setTypeName("Gate Incharge");
    } else if (type === "admin") {
      users = await api.ACL("getAllAdmin", {}, limit, filter);
      setTypeName("Admin");
    } else if (type === "security") {
      users = await api.ACL("getAllSecurity", {}, limit, filter);
      setTypeName("Security");
    }
    setData(users.data);
    setOData(users.data);
  };

  const handleRemove = async (val) => {
    for (let i = 0; i < val.length; i++) {
      const id = val[i];
      try {
        if (type === "gateIncharge") {
          await api.ACL("removeGateIncharge", { userId: id });
        } else if (type === "admin") {
          await api.ACL("removeAdmin", { userId: id });
        } else if (type === "security") {
          await api.ACL("removeSecurity", { userId: id });
        }

        await fetchData();
        enqueueSnackbar("DONE", { variant: "success" });
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
      }
    }
  };

  const search = async (value) => {
    const newData = OData.filter(
      (v) =>
        v.email.toLowerCase().includes(value.toLowerCase()) ||
        v.name.toLowerCase().includes(value.toLowerCase())
    );

    if (newData.length === 0 || value === "") {
      await fetchData(50, value);
    } else {
      setData(newData);
    }
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

  const handleChangeId = (val) => {
    if (val[0]) {
      setAclId(val[0]._id);
    }
  };

  const type = new URLSearchParams(props.location.search).get("type");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await api.GET_USER();
      localStorage.setItem("$user", JSON.stringify(user.data));
      if (user && user.data.acl.indexOf("$admin") !== -1) {
        setIsAdmin(true);
        await fetchData();
      }

      if (user && user.data.acl.indexOf("$security") !== -1) {
        setIsSecurity(true);
      }

      if (user && user.data.acl.indexOf("$gate") !== -1) {
        setIsGate(true);
      }
    };

    if (!localStorage.getItem("$token")) {
      history.push("/");
    } else {
      fetchUser();
    }
  }, [type]);

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
        <Divider />
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
            <Grid item xs={12} md={12} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={10} md={10} lg={10}>
                  <SelectEmail
                    handleChangeId={handleChangeId}
                    type="userManager"
                  ></SelectEmail>
                  {/* <AsyncSelect
                    cacheOptions
                    defaultOptions
                    onChange={handleInputChange}
                    loadOptions={promiseOptions}
                  /> */}
                </Grid>
                <Grid item xs={12} md={2} lg={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!aclId}
                    onClick={onSubmit}
                  >
                    Add {typeName}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Table
                data={data}
                typeName={typeName}
                fetchData={fetchData}
                handleSearch={search}
                handleRemove={handleRemove}
              ></Table>
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
