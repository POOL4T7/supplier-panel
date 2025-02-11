import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import axiosInstance from '../../axios';
import { useAtom } from 'jotai';
import { userDetailsAtom } from '../../storges/user';
import { useState } from 'react';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';
import { Box, TextField } from '@mui/material';

export default function AccountDelete({ open, setOpen }) {
  const [userDetails] = useAtom(userDetailsAtom);
  const [loading, setLoading] = useState(false);
  const [formNumber, setFormNumber] = useState(0);
  const [otp, setOtp] = useState(new Array(6).fill(''));

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if a digit is entered
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, otp.length);
    setOtp(pastedData.split(''));
  };

  const deleteProfile = async () => {
    try {
      setLoading(true);
      if (formNumber == 0) {
        const res = await axiosInstance.get(
          `/proxy/productsearchsupplier/api/userProfile/deleteUserProfile?userProfileId=${userDetails.id}`
        );

        toast.success(res.data);
        setFormNumber(1);
      } else {
        await axiosInstance.post(
          `/proxy/productsearchsupplier/api/userProfile/deleteUserProfileConfirmation`,
          {
            supplierProfileId: userDetails.id,
            deleteOTP: otp.join(''),
          }
        );

        localStorage.removeItem('user');
        localStorage.removeItem('authAccessToken');
        window.location.href = '/';
      }
      setLoading(false);
    } catch (e) {
      toast.error(
        e?.response?.data ||
          e?.response?.data?.message ||
          'Something went wrong, please try again after some time.'
      );
      console.log(e);
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={setOpen}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth={'sm'}
      >
        <DialogTitle id='alert-dialog-title'>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          {formNumber == 0 && (
            <DialogContentText id='alert-dialog-description'>
              Are you sure you want to delete your account? Upon confirming, you
              will receive a confirmation email at your registered email
              address. Please note that this action cannot be undone.
            </DialogContentText>
          )}
          {formNumber == 1 && (
            <DialogContent>
              Enter the OTP you recieved in your email.
              <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                gap={1}
                onPaste={handlePaste}
              >
                {otp.map((value, index) => (
                  <TextField
                    key={index}
                    id={`otp-input-${index}`}
                    value={value}
                    onChange={(e) =>
                      handleChange(e.target.value.replace(/[^0-9]/g, ''), index)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    inputProps={{
                      maxLength: 1,
                      style: {
                        textAlign: 'center',
                        fontSize: '1rem',
                        width: '1.5rem',
                      },
                    }}
                    variant='outlined'
                  />
                ))}
              </Box>
            </DialogContent>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={setOpen}>Cancel</Button>
          <Button disabled={loading} onClick={deleteProfile} color='error'>
            {loading && <Spinner width='15px' height='15px' />}{' '}
            {formNumber == 0 ? 'Send Email' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AccountDelete.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
};
