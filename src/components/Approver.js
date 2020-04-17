import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Verified from "./../assets/v.webp";
import UnVerified from "./../assets/nv.png";
import api from "./../api";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
  },
  media: {
    height: 500,
  },
});

export default function MediaCard(props) {
  const classes = useStyles();
  const [user, setUser] = React.useState();
  const [pass, setPass] = React.useState();
  const [count, setCount] = React.useState(0);
  const id = new URLSearchParams(props.location.search).get("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.GET_APPROVER(id);
        setUser(data.data.user);
        setPass(data.data.pass);
        setCount(data.data.count);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="verified">
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={user ? Verified : UnVerified}
            title="Contemplative Reptile"
          />
          {user && pass ? (
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2">
                Number of times this QR used : {count}
              </Typography>
              <Typography gutterBottom variant="subtitle2">
                {pass.state}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Name : {user.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Email : {user.email}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                EmpId : {user.empId}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Telephone : {user.telephone}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Designation : {user.designation}
              </Typography>
            </CardContent>
          ) : (
            <Typography gutterBottom variant="h6" component="h2" align="center">
              NOT VERIFIED
            </Typography>
          )}
        </CardActionArea>
      </Card>
    </div>
  );
}
