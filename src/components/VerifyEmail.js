import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import api from "./../api";

export default function VerifyEmail(props) {
  const { enqueueSnackbar } = useSnackbar();
  let history = useHistory();

  useEffect(() => {
    async function verify() {
      try {
        const token = new URLSearchParams(props.location.search).get("token");
        const user = await api.VERIFY_EMAIL(token);

        enqueueSnackbar(user.data.message, { variant: "success" });
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
      }
      history.push("/signin");
    }
    verify();
  });

  return (
    <div className="c_verify">Please wait! We are verifing your account</div>
  );
}
