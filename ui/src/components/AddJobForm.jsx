import { Box, FormControl, FormLabel, TextField, Button } from '@mui/material';
import { useState } from 'react';
import {scheduleParser} from '../utils/validateSchedule';
import { Link, useNavigate } from 'react-router-dom';
import PopoverButton from './PopoverButton';
import { ACCENT_COLOR, THEME_COLOR, MUTED_ACCENT } from '../constants/colors';
import { scheduleString } from '../utils/scheduleString';

const AddJobForm = ({ onSubmitAddForm, addErrorMessage }) => {
  const [schedule, setSchedule] = useState('');
  const [name, setJobName] = useState('');
  const [command, setCommand] = useState('');
  const [tolerableRuntime, setTolerableRuntime] = useState('');
  const navigate = useNavigate();

  const handleValidateForm = () => {
    if (!schedule) {
      addErrorMessage("Must have a schedule.");
      return false;
    }
    const parsedSchedule = scheduleParser(schedule);

    if (!parsedSchedule.valid) {
      addErrorMessage(parsedSchedule.error);
      return false;
    }
    return true;
  }

  const handleSubmitForm = () => {
    const jobData = {
      schedule: schedule,
      name: name || undefined,
      command: command || undefined,
      tolerableRuntime: tolerableRuntime || undefined,
      type: 'dual'
    };

    navigate('/jobs');
    return onSubmitAddForm(jobData);
  }

  const boxStyle = {
    width: '100%',
    padding: '20px',
    margin: '10px',
  };

  const divStyle = {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    backgroundColor: THEME_COLOR,
    borderRadius: '8px',
    maxWidth: '90%', 
  }

  return (
    <div style={{marginTop: '20px', marginLeft: '5%'}}>
      <Link to="/jobs">
        <Button sx={{marginBottom: '20px', marginLeft: '10px'}} variant="contained">Back</Button>
      </Link>       
      <div style={divStyle}>
      <FormControl  margin="normal" variant="outlined" sx={{margin: '20px' }}>
        <FormLabel sx={{fontSize:'20px'}}>New Job</FormLabel>
        <Box
          component="form"
          sx={boxStyle}
          noValidate
          autoComplete="off"
          >
          <TextField
            required
            sx={{
              padding: '5px',
              '&.MuiTextField-root .MuiOutlinedInput-notchedOutline': {
                borderColor: MUTED_ACCENT,
              },
              '&.MuiTextField-root input': {
                color: ACCENT_COLOR,
              },
              '&.MuiTextField-root label': {
                color: ACCENT_COLOR,
              },
            }}
            id="outlined-required"
            label="Schedule (required)"
            helperText={scheduleString(schedule)}
            placeholder="* * * * *"
            value={schedule}
            onChange={(e) => { setSchedule(e.target.value)}}
            FormHelperTextProps={{ style: { color: ACCENT_COLOR } }}
          />
          <TextField
            sx={{
              padding: '5px',
              '&.MuiTextField-root .MuiOutlinedInput-notchedOutline': {
                borderColor: MUTED_ACCENT,
              },
              '&.MuiTextField-root input': {
                color: ACCENT_COLOR,
              },
              '&.MuiTextField-root label': {
                color: ACCENT_COLOR,
              },
            }}
            id="outlined-basic"
            label="Name"
            value={name}
            placeholder='Test Job'
            onChange={(e) => setJobName(e.target.value)}
          />
          <TextField
            sx={{
              padding: '5px',
              '&.MuiTextField-root .MuiOutlinedInput-notchedOutline': {
                borderColor: MUTED_ACCENT,
              },
              '&.MuiTextField-root input': {
                color: ACCENT_COLOR,
              },
              '&.MuiTextField-root label': {
                color: ACCENT_COLOR,
              },
            }}
            id="outlined-basic"
            label="Command"
            value={command}
            placeholder='test-job.sh'
            onChange={(e) => setCommand(e.target.value)}
          />
          <TextField
            sx={{
              padding: '5px',
              '&.MuiTextField-root .MuiOutlinedInput-notchedOutline': {
                borderColor: MUTED_ACCENT,
              },
              '&.MuiTextField-root input': {
                color: ACCENT_COLOR,
              },
              '&.MuiTextField-root label': {
                color: ACCENT_COLOR,
              },
            }}
            id="outlined-basic"
            label='Tolerable Runtime (s)'
            value={tolerableRuntime}
            placeholder='0'
            onChange={(e) => setTolerableRuntime(e.target.value)}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '5px',
            }}
            >
            <PopoverButton variant='contained' onValidate={handleValidateForm} onAction={handleSubmitForm} buttonName={'Submit'} heading={"Are you sure of the changes you've made?"}></PopoverButton>
          </Box>
        </Box>
      </FormControl>
      </div>
    </div>
  )
}

export default AddJobForm;
