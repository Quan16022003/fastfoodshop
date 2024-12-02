import { Snackbar, Alert } from '@mui/material';
import PropTypes from 'prop-types';

function CustomAlert({ open, severity, message, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={1000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

CustomAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']).isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomAlert; 