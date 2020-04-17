import React from "react";
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
import { useHistory } from "react-router-dom";
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  // const [loading, setLoading] = React.useState(false);
  let history = useHistory();

  let newPassword, password;

  const submit = async (event) => {
    event.preventDefault();
    if (newPassword === password && password !== "") {
      try {
        const token = new URLSearchParams(props.location.search).get("token");
        await api.UPDATE_USER_PROFILE({ password }, token);
        enqueueSnackbar("Successful", { variant: "success" });
        history.push("/signin");
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
      }
    } else {
      enqueueSnackbar("Both password not same.", { variant: "error" });
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
          Enter your new password!
        </Typography>
        <form className={classes.form} onSubmit={submit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            type="password"
            fullWidth
            onInput={(event) => {
              newPassword = event.target.value;
            }}
            label="New Password"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            type="password"
            onInput={(event) => {
              password = event.target.value;
            }}
            fullWidth
            label="Repeat Password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Reset
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/signin" variant="body2">
                Sign In
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
