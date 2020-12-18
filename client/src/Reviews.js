import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import { red, blue } from '@material-ui/core/colors';
import FormHelperText from "@material-ui/core/FormHelperText";

import { Link as RouterLink } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Link,
  useHistory,
  useLocation,
  useParams
} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

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

      console.log(`first result`);
      console.log(JSON.stringify(data.result[0]));
      setReviews(data.result);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
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
    container: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: 'auto',
      },
    }
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
  let totals = {
    rating: 0,
    difficulty: 0,
    hoursPerWeek: 0
  };
  filteredReviews.forEach(r => {
    totals.rating += r.rating;
    totals.difficulty += r.difficulty;
    totals.hoursPerWeek += r.hours_per_week;
  });
  let averages = {
    rating: totals.rating / filteredReviews.length,
    difficulty: totals.difficulty / filteredReviews.length,
    hoursPerWeek: totals.hoursPerWeek / filteredReviews.length
  };
  console.log(`first review 2`);
  console.log(filteredReviews[0]);

  return (<>
      <Container className={classes.container} maxWidth={"lg"}>
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
        <Averages data={averages} />
        <ReviewForm course_code={filteredReviews[0]?.course_code} updateReviews={() => fetchAsync()}/>
        <Reviews reviews={filteredReviews} />
      </Container>
  </>);
}

const useFormStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function ReviewForm(props) {
  let [text, setText] = useState('');
  let [rating, setRating] = useState('');
  let [difficulty, setDifficulty] = useState('');
  let [hours, setHours] = useState('');
  let { course_code, updateReviews } = props;
  const classes = useFormStyles();

  const handleSubmit = (event) => {
      const asyncPost = async () => {
        const fetchURL = `/api/addreview`;
        const sendData = {
          text,
          rating,
          difficulty,
          hours,
          course_code
        };
        try {
          console.log(`sending data: ${JSON.stringify(sendData)}`);
          const r = await fetch(fetchURL, {
            method: 'post',
            body: JSON.stringify(sendData),
            headers: {
              'Content-Type': 'application/json'
            },
          });
          const data = await r.json();
          if (data.status === 'ok') {
            updateReviews();
            setText('');
            setRating('');
            setDifficulty('');
            setHours('');
          }
        } catch (error) {
          console.error(error);
        }
      }
      asyncPost();
      event.preventDefault();
      return false;
  }

  return (<form onSubmit={handleSubmit}>
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="rating-native-required">Rating</InputLabel>
      <Select
          native
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          name="rating"
          inputProps={{
            id: 'rating-native-required',
          }}
      >
        <option aria-label="None" value="" />
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="difficulty-native-required">Difficulty</InputLabel>
      <Select
          native
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          name="difficulty"
          inputProps={{
            id: 'difficulty-native-required',
          }}
      >
        <option aria-label="None" value="" />
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="hours-native-required">Hours/Week</InputLabel>
      <Select
          native
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          name="hours"
          inputProps={{
            id: 'hours-native-required',
          }}
      >
        <option aria-label="None" value="" />
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
    <textarea value={text} placeholder={"Leave a review"} onChange={(event) => setText(event.target.value)}
      style={{display: 'block', minWidth: '500px', minHeight: '100px'}}
    />
    <Button type="submit" variant="contained">Post Review</Button>
  </form>);
}

const useAveragesStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
    justifyContent: 'center',
    alignItems: 'center'
  },
  size: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  red: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500]
  },
  blue: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500]
  },
}));

function Averages(props) {
  const { data } = props;
  const classes = useAveragesStyles();

  return (
      <div className={classes.root}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Avatar className={`${classes.size} ${classes.blue}`}>{ data.rating || 0 }</Avatar>
          <Typography component="h2" variant="h5">
            Average Rating
          </Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Avatar className={`${classes.size} ${classes.red}`}>{ data.difficulty || 0 }</Avatar>
          <Typography component="h2" variant="h5">
            Average Difficulty
          </Typography>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Avatar className={classes.size}>{ data.hoursPerWeek || 0 }</Avatar>
          <Typography component="h2" variant="h5">
            Average Hours/Week
          </Typography>
        </div>
      </div>
  );
}

function InstructorReviews(props) {
  return (<>
    <div>Hello, instructor reviews!</div>
  </>);
}

function Reviews(props) {
  let { reviews } = props;

  const useStyles = makeStyles({
      card: {
        display: 'flex',
        marginBottom: '20px',
        maxWidth: '800px'
      },
      cardDetails: {
        flex: 1,
      },
      chip: {
          marginLeft: '20px'
      }
    });


  const classes = useStyles();

  return (<>
    { reviews.map((review, index) => (
        <Card key={index} className={classes.card}>
          <div className={classes.cardDetails}>
            <CardContent style={{textAlign: 'center'}}>
                <Chip color="primary" avatar={<Avatar>{review.rating}</Avatar>} label={"Rating"} />
                <Chip className={classes.chip} color="secondary" avatar={<Avatar>{review.difficulty}</Avatar>} label={"Difficulty"} />
                <Chip className={classes.chip} avatar={<Avatar>{review.hours_per_week}</Avatar>} label={"Hours/Week"} />
              <Typography style={{marginTop: '10px'}} variant="subtitle1" color="textSecondary">
                {review.review_date}
              </Typography>
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60px'}}>
                <Typography variant="subtitle1" paragraph>
                  {review.review_text}
                </Typography>
              </div>
            </CardContent>
          </div>
        </Card>
      ))
    }
  </>);
}


export { Reviews, CourseReviews, InstructorReviews, deptToLabel };
