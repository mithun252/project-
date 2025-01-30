import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Container, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  title: {
    marginBottom: theme.spacing(3),
    color: '#002f34'
  },
  feature: {
    marginBottom: theme.spacing(2),
    color: '#666'
  }
}));

const About = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="md">
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h3" component="h1" className={classes.title}>
          Welcome to OLX Clone
        </Typography>
        <Typography variant="h6" className={classes.feature}>
          A platform to buy and sell items locally
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.title}>
              Features
            </Typography>
          </Grid>
          {[
            'Browse items for sale',
            'Post your items',
            'Contact sellers',
            'Secure transactions'
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper className={classes.paper} elevation={1}>
                <Typography variant="h6" className={classes.feature}>
                  {feature}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default About;
