import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, itemName }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        ¿Eliminar este elemento?
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {`¿Estás seguro de que deseas eliminar?. Esta acción no se puede deshacer.`}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;