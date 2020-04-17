import React from "react";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useSnackbar } from "notistack";
import api from "./../api";

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  let history = useHistory();
  let email, password, name, designation, empId, telephone;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const user = await api.SIGNUP(email, password, name, designation, empId, telephone);
      enqueueSnackbar(user.data.message, { variant: "success" });
      setLoading(false);
      history.push("/signin");
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="fname"
                name="fullName"
                variant="outlined"
                onInput={(event) => {
                  name = event.target.value;
                }}
                required
                fullWidth
                id="fullName"
                label="Full Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="email"
                name="email"
                variant="outlined"
                onInput={(event) => {
                  email = event.target.value;
                }}
                required
                fullWidth
                id="email"
                label="Email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="designation"
                name="designation"
                variant="outlined"
                onInput={(event) => {
                  designation = event.target.value;
                }}
                required
                fullWidth
                id="designation"
                label="Designation"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                autoComplete="telephone"
                name="telephone"
                variant="outlined"
                onInput={(event) => {
                  telephone = event.target.value;
                }}
                required
                fullWidth
                id="telephone"
                label="Telephone"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                onInput={(event) => {
                  empId = event.target.value;
                }}
                id="empId"
                label="Emp Id"
                name="Emp Id"
                autoComplete="empId"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                onInput={(event) => {
                  password = event.target.value;
                }}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
