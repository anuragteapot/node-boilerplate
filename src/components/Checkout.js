import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddressForm from "./AddressForm";
import { useSnackbar } from "notistack";
import PaymentForm from "./PaymentForm";
import { useHistory } from "react-router-dom";
import Review from "./Review";
import api from "./../api";
import logo from "./../assets/iitp.png";
import SelectEmail from "./SelectEmail";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 700,
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
  stepper: {
    padding: theme.spacing(3, 0, 5),
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

let formData = {
  approverEmail: "",
  from: "",
  trolley_no: "",
  room: "",
  to: "",
  title: "",
  data: [],
};

const handleChangeData = (val) => {
  formData.data = val;
};

const handleChangeFrom = (val) => {
  formData.from = val;
};

const handleChangeTrolleyNo = (val) => {
  formData.trolley_no = val;
};

const handleChangeRoom = (val) => {
  formData.room = val;
};

const handleChangeTo = (val) => {
  formData.to = val;
};

const handleChangeTitle = (val) => {
  formData.title = val;
};

const handleChangeApproverEmail = (val) => {
  formData.approverEmail = val;
};

const steps = [
  "Descriptions of items",
  "Required information",
  "Review your gate pass",
];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm handleChangeData={handleChangeData} />;
    case 1:
      return (
        <PaymentForm
          handleChangeTitle={handleChangeTitle}
          handleChangeTo={handleChangeTo}
          handleChangeRoom={handleChangeRoom}
          handleChangeTrolleyNo={handleChangeTrolleyNo}
          handleChangeFrom={handleChangeFrom}
        />
      );
    case 2:
      return <Review formData={formData} />;
    default:
      throw new Error("Unknown step");
  }
}

export default function Checkout() {
  const classes = useStyles();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = React.useState(0);
  const [id, setId] = React.useState();
  const [loding, setLoading] = React.useState(false);

  if (!localStorage.getItem("$token")) {
    window.location.href = "/";
  }

  const handleNext = async () => {
    if (activeStep === 2) {
      setLoading(true);
      try {
        const pass = await api.CREATE_PASS(formData);
        setId(pass.data.id);
        setActiveStep(activeStep + 1);
        enqueueSnackbar("Pass Requested", { variant: "success" });
        formData = {
          approverEmail: "",
          from: "",
          trolley_no: "",
          room: "",
          to: "",
          title: "",
          data: [],
        };
      } catch (err) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      }
      setLoading(false);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

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
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your gate pass requested.
                </Typography>
                <Typography variant="subtitle1">
                  Your pass id is <strong>{id}</strong>. We have emailed your
                  gate pass confirmation, and will send you an update when your
                  gate pass has approved.
                </Typography>
                <Button
                  onClick={() => {
                    history.push(`/dashboard/view/${id}`);
                  }}
                  color="primary"
                  className={classes.button}
                >
                  View Pass
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <br></br>
                <SelectEmail
                  handleChangeApproverEmail={handleChangeApproverEmail}
                  type="checkout"
                ></SelectEmail>
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={loding}
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}
