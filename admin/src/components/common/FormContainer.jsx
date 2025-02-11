import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const FormContainer = ({ children }) => {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </div>
  );
};

export default FormContainer;

FormContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
