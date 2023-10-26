import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const Popover = ({ title, content, open, onClose, primaryButtonLabel, secondaryButtonLabel, onPrimaryButtonClick, onSecondaryButtonClick }) => {

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSecondaryButtonClick}>{secondaryButtonLabel}</Button>
          <Button onClick={onPrimaryButtonClick}>{primaryButtonLabel}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Popover;