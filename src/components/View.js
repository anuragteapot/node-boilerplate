import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ViewDetails from "./ViewDetails";
import Qr from "./Qr";
import api from "./../api";
import { useSnackbar } from "notistack";
import logo from "./../assets/iitp.png";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function View(props) {
  const classes = useStyles();
  const [action, setAction] = React.useState();
  const { enqueueSnackbar } = useSnackbar();
  const [passData, setPassData] = React.useState({
    approver: [],
    userData: {},
    pass: {},
  });

  const reject = async () => {
    try {
      await api.UPDATE_STATE(props.match.params.id, "REJECT");
      window.location.href = "/dashboard?action=" + action;
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const cancel = async () => {
    try {
      await api.UPDATE_STATE(props.match.params.id, "CANCEL");
      window.location.href = "/dashboard?action=" + action;
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const approve = async () => {
    try {
      if (action === "RAISED") {
        await api.UPDATE_STATE(props.match.params.id, "APPROVED");
      } else if (action === "APPROVED") {
        await api.UPDATE_STATE(props.match.params.id, "CHECKED");
      } else if (action === "CHECKED") {
        await api.UPDATE_STATE(props.match.params.id, "GATE_INCHARGE");
      }
      window.location.href = "/dashboard?action=" + action;
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const print = () => {
    window.print();
  };

  const act = new URLSearchParams(props.location.search).get("action");

  useEffect(
    function effectFunction() {
      if (!localStorage.getItem("$token")) {
        window.location.href = "/";
      }
      api.GET_PASS(props.match.params.id).then((pass) => {
        setPassData(pass.data);
        setAction(act);
      });
    },
    [act]
  );

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <div className="c_img">
            <img alt="logo" src={logo} width="100"></img>
          </div>
          <Typography component="h3" variant="h6" align="center">
            Gate Pass
          </Typography>
          <Typography variant="subtitle1" align="center">
            Indian Institute of Technology Patna Bihta, Bihar, India-801106
          </Typography>
          <Qr approver={passData.approver} userData={passData.userData}></Qr>
          <hr></hr>
          <ViewDetails pass={passData.pass}></ViewDetails>
          <React.Fragment>
            <div className={classes.buttons}>
              {action === "MY" && action !== "VIEW" ? (
                <Button onClick={cancel} color="secondary">
                  Cancel
                </Button>
              ) : action && action !== "VIEW" ? (
                <div>
                  <Button onClick={approve} color="primary">
                    Approve
                  </Button>

                  <Button onClick={reject} color="secondary">
                    Reject
                  </Button>
                </div>
              ) : (
                ""
              )}
              &nbsp;
              <Button onClick={print}>Print</Button>
            </div>
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}
