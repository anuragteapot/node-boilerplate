import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export default function Review(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Summary
      </Typography>
      <br></br>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <div className={classes.root}>
            <Typography variant="subtitle2" gutterBottom>
              Title :
            </Typography>
            {props.formData.title}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.root}>
            <Typography variant="subtitle2" gutterBottom>
              From :
            </Typography>
            {props.formData.from}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.root}>
            <Typography variant="subtitle2" gutterBottom>
              To :
            </Typography>
            {props.formData.to}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.root}>
            <Typography variant="subtitle2" gutterBottom>
              Room :
            </Typography>
            {props.formData.room}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.root}>
            <Typography variant="subtitle2" gutterBottom>
              Trolley No :
            </Typography>
            {props.formData.trolley_no}
          </div>
        </Grid>
      </Grid>
      <br></br>
      <Typography variant="h6" gutterBottom>
        Item Details
      </Typography>
      <List disablePadding>
        {props.formData.data.map((product) => (
          <ListItem className={classes.listItem} key={product.name}>
            <ListItemText primary={product.name} secondary={product.review} />
            <Typography variant="body2">{product.quantity}</Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}
