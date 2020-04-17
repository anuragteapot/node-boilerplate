import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import shortid from "shortid";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function AddressForm(props) {
  const [open, setOpen] = React.useState(false);
  let [products, setProducts] = React.useState([]);

  let quantity, remarks, name;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDone = () => {
    products.push({ quantity, remarks, name, id: shortid.generate() });
    props.handleChangeData(products);
    setOpen(false);
  };

  const deleteItem = (val) => {
    const filter = products.filter((v) => v.id !== val);
    setProducts(filter);
    props.handleChangeData(filter);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Descriptions of Items
      </Typography>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Add item details.</DialogContentText>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                required
                id="quantity"
                name="quantity"
                label="Quantity"
                onInput={(event) => {
                  quantity = event.target.value;
                }}
                fullWidth
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="quantity"
                name="quantity"
                label="Descriptions of Items"
                onInput={(event) => {
                  name = event.target.value;
                }}
                fullWidth
                type="text"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                id="Remarks"
                name="Remarks"
                label="Remarks"
                onInput={(event) => {
                  remarks = event.target.value;
                }}
                fullWidth
                type="text"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDone} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <List disablePadding>
        {products.map((product) => (
          <ListItem className={classes.listItem} key={product.name}>
            <ListItemText primary={product.name} secondary={product.remarks} />
            <Typography variant="body2">
              {product.quantity}
              <IconButton
                color="secondary"
                aria-label="delete"
                onClick={() => {
                  deleteItem(product.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Typography>
          </ListItem>
        ))}
      </List>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            onClick={handleClickOpen}
            startIcon={<Add />}
          >
            Add Item
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
