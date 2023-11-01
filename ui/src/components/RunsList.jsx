import React from 'react';
import { useState, useEffect } from 'react';
import { List, Box, Typography, Button, Divider, Grid, Pagination } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Run from './Run'
import DeleteButton from './DeleteButton';
import { getRuns } from '../services/jobs';
import { PAGE_LIMIT } from '../constants/pagination';
import calculateOffset from '../utils/calculateOffset';
import { getSse } from '../services/sse';
import { getJob } from '../services/jobs';


const RunsList = ({ onDelete, onError }) => {
  const { id } = useParams();
  const [runs, setRuns] = useState([]);
  const [job, setJob] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try { 
        // const currentJob = await getJob(id);
        setTimeout(() => {
        const currentJob = {id: 6, schedule:"* * * * *", endpoint_key: "32423"}
        setJob(currentJob);

        }, 5000)
     
      } catch (error) {
        onError(error);
      }
    }

    fetchJob();
  }, []);

  useEffect(() => {
    const newSse = getSse();

    newSse.onerror = (error) => {
      console.log('An error occured establishing an SSE connection.');
      newSse.close();
    };

    newSse.addEventListener('newRun', (event) => {
      if (page !== 1) return;

      const newRun = JSON.parse(event.data);
      console.log('New run:', newRun);

      setRuns(runs => {
        console.log("setting new runs");

        if (job && job.id === newRun.monitor_id && !runs.find(run => run.id === newRun.id)) {
          const newRunData = [newRun].concat(runs);
          if (newRunData.length > PAGE_LIMIT) {
            newRunData.length = PAGE_LIMIT;
          }
          return newRunData;
        } else {
          return runs;
        }
      });
    });

    newSse.addEventListener('updatedRun', (event) => {
      const updatedRun = JSON.parse(event.data);
      console.log('Updated run:', updatedRun);

      setRuns(runs => {
        if (job && job.id === updatedRun.monitor_id) {
          return runs.map(run => {
              if (run.id === updatedRun.id) {
                return updatedRun;
              } else {
                return run;
              }
            });
        } else {
          return runs;
        }
      });
    });

    return () => {
      console.log("Cleaning up SSE connection");
      newSse.close();
    };
  }, []);


  useEffect(() => {
    const fetchRuns = async () => {
      try { 
        const data = await getRuns(job.id, PAGE_LIMIT, calculateOffset(page, PAGE_LIMIT));
        setRuns(data.runs);
        setTotalPages(data.totalPages);
      } catch (error) {
        onError(error);
      }
    }

    if (job) {
      fetchRuns();
    }
  }, [page, job]);
  
  const handleDelete= () => {
    navigate("/");
    onDelete(job.id);
  }

  const onPageChange = (_, newPage) => {
    setPage(newPage);
  }

  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: "#f9fbe7",
    borderRadius: '8px',
    maxWidth: '90%', 
  }

  return (
    <div style={{ marginTop: '20px', marginLeft: '5%'}}>
      <Button onClick={() => navigate(-1)} sx={{marginBottom: '20px', marginLeft: '10px'}} variant="contained">Back</Button>
      <div style={divStyle}>
        <Box sx={boxStyle}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <Typography variant="h4">Monitor: {job.name || 'A job'} Id: {job.id} </Typography>
            </Grid>
            <Grid item xs={2}>
            <Link to={`/edit/${job.id}`}>
              <Button sx={{ fontSize: '18px', margin: '5px' }} variant="contained">EDIT</Button>
            </Link>
            </Grid>
            <Grid item xs={2}>
              <DeleteButton onDelete={handleDelete} />
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Schedule:</Typography>
            </Grid>
            <Grid item xs={3}>
              {job.command && (
              <Typography variant="body2">Command:</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Endpoint:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Status:</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{job.schedule}</Typography>
            </Grid>
            <Grid item xs={3}>
              {job.command && (
              <Typography variant="body1">{job.command}</Typography>
              )}
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{job.endpoint_key}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body1">{job.failing ? 'Failing.' : 'All Sunny!'}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <List>
            {runs.map((run) => (
            <Run run={run} key={run.id}/>
            ))}
          </List>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Pagination count={totalPages} size="large" page={page} onChange={onPageChange} />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default RunsList;
