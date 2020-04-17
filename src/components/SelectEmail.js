import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import api from "./../api";

export default function SelectEmail(props) {
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const type = props.type;

  React.useEffect(() => {
    const fetch = async () => {
      if (type === "checkout") {
        const res = await api.GET_ALL_ADMIN(50, inputValue);
        setOptions(res.data);
      } else if (type === "userManager") {
        const res = await api.ACL("getAllUser", {}, 10, inputValue);
        setOptions(res.data);
      }
    };

    fetch();
  }, [inputValue, type]);

  return (
    <Autocomplete
      style={{ width: "100%" }}
      getOptionLabel={(option) => option.email}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      onSelect={(event) =>
        type === "checkout"
          ? props.handleChangeApproverEmail(event.target.value)
          : type === "userManager"
          ? props.handleChangeId(
              options.filter((val) => val.email === event.target.value)
            )
          : ""
      }
      includeInputInList
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select approver email"
          variant="outlined"
          fullWidth
          onChange={handleChange}
        />
      )}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="subtitle2" gutterBottom>
                {option.email} ({option.name})
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}
