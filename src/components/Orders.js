import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

const columns = [
  {
    id: "title",
    label: "Title",
    minWidth: 200,
    format: (value, action = "", state = "") => value.slice(0, 20),
  },
  { id: "from", label: "From", minWidth: 100 },
  {
    id: "to",
    label: "To",
    minWidth: 100,
    align: "right",
  },
  {
    id: "created_at",
    label: "Created Date",
    minWidth: 100,
    align: "right",
    format: (value, action = "", state = "") => new Date(value).toUTCString(),
  },
  {
    id: "updated_at",
    label: "Updated Date",
    minWidth: 100,
    align: "right",
    format: (value, action = "", state = "") => new Date(value).toUTCString(),
  },
  {
    id: "state",
    label: "State",
    minWidth: 100,
    align: "right",
    format: (value, action = "", state = "") => (
      <span className={state}>{value}</span>
    ),
  },
  {
    id: "_id",
    label: "Action",
    minWidth: 100,
    align: "right",
    format: (value, action = "", state = "") => (
      <Button
        variant="contained"
        color={
          state === "CANCEL" || state === "REJECT" || state === "GATE_INCHARGE"
            ? "primary"
            : "secondary"
        }
        onClick={() => {
          window.location.href =
            "/dashboard/view/" +
            value +
            "?action=" +
            (state === "CANCEL" ||
            state === "REJECT" ||
            state === "GATE_INCHARGE"
              ? "VIEW"
              : action
              ? action
              : "MY");
        }}
      >
        {state === "CANCEL" || state === "REJECT" || state === "GATE_INCHARGE"
          ? "View"
          : "Action"}
      </Button>
    ),
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 800,
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rows = props.data;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = async (event) => {
    setRowsPerPage(+event.target.value);
    await props.fetchData(event.target.value, props.action);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <Toolbar>
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {props.action ? props.action : "MY"}
        </Typography>
      </Toolbar>
      <Input
        fullWidth
        onInput={(event) => {
          props.handleSearch(event.target.value);
        }}
        placeholder="Search..."
        inputProps={{ "aria-label": "description" }}
      />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format
                            ? column.format(value, props.action, row["state"])
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100, 200]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
