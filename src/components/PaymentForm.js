import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

export default function PaymentForm(props) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <TextField
            required
            id="Title"
            label="Title"
            fullWidth
            onInput={(event) => {
              props.handleChangeTitle(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="from"
            label="From"
            fullWidth
            onInput={(event) => {
              props.handleChangeFrom(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="Trolley"
            label="Trolley No"
            fullWidth
            onInput={(event) => {
              props.handleChangeTrolleyNo(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="Room"
            label="Room"
            type="number"
            fullWidth
            onInput={(event) => {
              props.handleChangeRoom(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="To"
            label="To"
            fullWidth
            onInput={(event) => {
              props.handleChangeTo(event.target.value);
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
