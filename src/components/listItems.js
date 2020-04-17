import React from "react";
import Link from "@material-ui/core/Link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import Divider from "@material-ui/core/Divider";
import AssignmentIcon from "@material-ui/icons/Assignment";

export const mainListItems = (
  <div>
    <Link href="/dashboard">
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>
    <Link href="/pass">
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Create Pass" />
      </ListItem>
    </Link>
  </div>
);

export const adminListItems = (
  <div>
    <Link href="/dashboard">
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>
    <Divider></Divider>
    <ListSubheader inset>Create Pass</ListSubheader>
    <Link href="/pass">
      <ListItem button>
        <ListItemIcon>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Create Pass" />
      </ListItem>
    </Link>
    <Divider></Divider>
    <ListSubheader inset>User Manager</ListSubheader>
    <Link href="/dashboard/user-manager?type=admin">
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Admin Manager" />
      </ListItem>
    </Link>
    <Link href="/dashboard/user-manager?type=security">
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Security Manager" />
      </ListItem>
    </Link>
    <Link href="/dashboard/user-manager?type=gateIncharge">
      <ListItem button>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Gate Inc. Manager" />
      </ListItem>
    </Link>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>All Done</ListSubheader>
    <Link href="/dashboard?action=GATE_INCHARGE">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Gate" />
      </ListItem>
    </Link>
    <Link href="/dashboard?action=REJECT">
      <ListItem button>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Rejected" />
      </ListItem>
    </Link>
  </div>
);
