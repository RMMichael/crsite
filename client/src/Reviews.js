import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import { Link as RouterLink } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Link,
  useHistory,
  useLocation, useParams
} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

// should be defined in backend ?
const courseLabels = [
  { dept: "CompSci", label: "CS"  },
  { dept: "In4matx", label: "INF" },
  { dept: "I&C Sci", label: "ICS" },
  { dept: "SWE", label: "SWE" },
  { dept: "Stats", label: "STATS" }
]

const deptToLabel = (dept) => courseLabels.filter(x => (x.dept.toUpperCase() === dept.toUpperCase()))[0]?.label;
const labelToDept = (label) => courseLabels.filter(x => (x.label.toUpperCase() === label.toUpperCase()))[0]?.dept;

function CourseReviews(props) {
  let { courseLabel } = useParams();
  // split into dept and number
  let r = /^(?<label>.+?)(?<number>\d+[^\d]*)$/;
  let match = r.exec(courseLabel);

  if (!match) {
    return <div>no course found: {`${courseLabel}`}</div>;
  }

  let dept = labelToDept(match.groups.label);
  let number = match.groups.number;

  let [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchAsync = async () => {
      try {
        const result = await fetch(`/api/course?${new URLSearchParams({dept, number})}`);
        if (!result.ok) {
          throw new Error(result.text());
        }

        const data = await result.json();
        if (data.status !== 'ok') {
          console.table(data);
          throw new Error('status not ok');
        }

        setReviews(data.result);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAsync();
  }, []);

  const useStyles = makeStyles((theme) => ({
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

  let instructors = [...new Set(reviews.map(r => r.instructor))];

  const classes = useStyles();
  const [instructor, setInstructor] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleChange = (event) => {
    setInstructor(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  }

  // default to no filter if instructor is not set
  let filteredReviews = reviews.filter(r => instructor ? r.instructor === instructor : true);

  return (<>
      <div>
        <Button className={classes.button} onClick={handleOpen}>
          Choose a Professor
        </Button>
        <FormControl className={classes.formControl}>
          <InputLabel id="professor-select">Professor</InputLabel>
          <Select
              labelId="professor-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={instructor || ""}
              onChange={handleChange}
          >
            <MenuItem value=""><em>All Professors</em></MenuItem>
            { instructors.map(instructor => (
                <MenuItem value={instructor}>{instructor}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>
      <Reviews reviews={filteredReviews} />
  </>);
}

function InstructorReviews(props) {
  return (<>
    <div>Hello, instructor reviews!</div>
  </>);
}

function Reviews(props) {



  let { reviews } = props;
  const classes = useStyles();
  const { post } = props;
  const useStyles = makeStyles((theme) => ({
    mainFeaturedPost: {
      position: 'relative',
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      marginBottom: theme.spacing(4),
      backgroundImage: 'url(https://source.unsplash.com/random)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: 'rgba(0,0,0,.3)',
    },
    mainFeaturedPostContent: {
      position: 'relative',
      padding: theme.spacing(3),
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(6),
        paddingRight: 0,
      },
    },
  }));

  return (
      <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(${post.image})` }}>
        {/* Increase the priority of the hero background image */}
        {<img style={{ display: 'none' }} src={post.image} alt={post.imageText} />}
        <div className={classes.overlay} />
        <Grid container>
          <Grid item md={6}>
            <div className={classes.mainFeaturedPostContent}>
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                {post.description}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Paper>
  );
    return (<>
      { reviews.map(review => (
          <Card className={classes.card}>
            <div className={classes.cardDetails}>
              <CardContent>
                <Typography component="h2" variant="h5">
                  {post.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {post.date}
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  {review.review_text}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Continue reading...
                </Typography>
              </CardContent>
            </div>
            <Hidden xsDown>
              <CardMedia className={classes.cardMedia} image={post.image} title={post.imageTitle} />
            </Hidden>
          </Card>
          <div>
            <div>{ review.review_text }</div>
          </div>
        ))
      }
    </>);
}


export { Reviews, CourseReviews, InstructorReviews, deptToLabel };
