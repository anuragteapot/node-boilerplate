import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import QRCode from "qrcode.react";

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
      <Grid container>
        {props.approver.map((item) =>
          item.state !== "REJECT" && item.state !== "CANCEL" ? (
            <Grid
              item
              container
              direction="column"
              xs={6}
              sm={6}
              key={item.state}
            >
              <Typography variant="h6" gutterBottom className={classes.title}>
                {item.state} BY
              </Typography>
              <Grid container>
                <React.Fragment key="name">
                  <Grid item xs={6}>
                    <Typography gutterBottom>Name :</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>
                      {props.userData[item.state].name}
                    </Typography>
                  </Grid>
                </React.Fragment>
                <React.Fragment key="email">
                  <Grid item xs={6}>
                    <Typography gutterBottom>Designation :</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>
                      {props.userData[item.state].designation}
                    </Typography>
                  </Grid>
                </React.Fragment>
                <React.Fragment key="Emp">
                  <Grid item xs={6}>
                    <Typography gutterBottom>Emp ID/ Pass No :</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>
                      {props.userData[item.state].empId}
                    </Typography>
                  </Grid>
                </React.Fragment>
                <React.Fragment key="telephone">
                  <Grid item xs={6}>
                    <Typography gutterBottom>Telephone :</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>
                      {props.userData[item.state].telephone}
                    </Typography>
                  </Grid>
                </React.Fragment>
                <React.Fragment key="time">
                  <Grid item xs={6}>
                    <Typography gutterBottom>Time :</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>
                      {new Date(item.created_at).toUTCString()}
                    </Typography>
                  </Grid>
                </React.Fragment>
              </Grid>
              <QRCode
                value={"https://localhost:3000/approver?id=" + item._id}
                size={100}
                level={"H"}
                includeMargin={true}
              />
            </Grid>
          ) : (
            <div className="watermark">
              <p> {item.state}ED </p>
            </div>
          )
        )}
      </Grid>
    </React.Fragment>
  );
}
