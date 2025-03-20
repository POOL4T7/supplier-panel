import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import axiosInstance from '../../axios';
import Spinner from '../../components/common/Spinner';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Users, CheckCircle, XCircle } from 'lucide-react';

const SupplierList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          '/proxy/productsearchadmin/api/admin/getAllSuppliers'
        );
        setData(res.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetch();
  }, []);

  const handleDownloadPDF = (item) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Formatting
    const marginX = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    // const pageHeight = doc.internal.pageSize.getHeight();
    let cursorY = 40; // Initial Y position

    // Header (Centered)
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('Welcome to Our Platform!', pageWidth / 2, cursorY, {
      align: 'center',
    });
    cursorY += 15;

    // Address Section
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.text('To:', marginX, cursorY);
    cursorY += 8;

    doc.text(
      `${item.supplierBusinessDetails?.businessName || 'N/A'}`,
      marginX,
      cursorY
    );
    cursorY += 6;

    doc.text(
      `${item.supplierBusinessDetails?.houseNo || ''}, ${
        item.supplierBusinessDetails?.streetName || ''
      }`,
      marginX,
      cursorY
    );
    cursorY += 6;

    doc.text(
      `${item.supplierBusinessDetails?.area || ''}, ${
        item.supplierBusinessDetails?.city || ''
      }`,
      marginX,
      cursorY
    );
    cursorY += 6;

    doc.text(
      `${item.supplierBusinessDetails?.zipcode || ''}, ${
        item.supplierBusinessDetails?.country || ''
      }`,
      marginX,
      cursorY
    );
    cursorY += 15;

    // Body Message
    doc.text('Dear Valued Partner,', marginX, cursorY);
    cursorY += 10;
    doc.text(
      'We are delighted to welcome you to our platform!',
      marginX,
      cursorY
    );
    cursorY += 10;
    doc.text(
      'To activate your account and start using our services, please use the OTP below:',
      marginX,
      cursorY
    );
    cursorY += 20;

    // OTP Section (Centered & Bold)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Your OTP: ${
        item.supplierBusinessDetails?.verificationAddressOTP || 'N/A'
      }`,
      pageWidth / 2,
      cursorY,
      { align: 'center' }
    );
    cursorY += 15;

    // Reset Font
    doc.setFontSize(12);
    doc.setFont('times', 'normal');

    // Closing
    doc.text(
      'If you have any questions, feel free to reach out to our support team.',
      marginX,
      cursorY
    );
    cursorY += 10;
    doc.text('We look forward to working with you.', marginX, cursorY);
    cursorY += 20;
    doc.text('Best Regards,', marginX, cursorY);
    cursorY += 10;
    doc.text('The Support Team', marginX, cursorY);

    // Footer (Right-Aligned)
    // doc.setFontSize(10);
    // doc.text(
    //   `Generated on: ${new Date().toLocaleDateString()}`,
    //   pageWidth - marginX,
    //   pageHeight - 20,
    //   { align: 'right' }
    // );

    // Save the document
    // doc.save(`Welcome_Letter_${item.supplierProfile?.id || 'Unknown'}.pdf`);
    // doc.autoPrint();
    const pdfUrl = doc.output('bloburl');
    window.open(pdfUrl);
  };

  const columns = [
    { field: 'id', headerName: 'S.no.', disableColumnMenu: true, width: 80 },
    {
      field: 'supplierId',
      headerName: 'Supplier ID',
      disableColumnMenu: true,
      width: 150,
      sortable: false,
    },
    {
      field: 'supplierName',
      headerName: 'Supplier Name',
      disableColumnMenu: true,
      width: 200,
      sortable: false,
    },
    {
      field: 'businessName',
      headerName: 'Business Name',
      disableColumnMenu: true,
      width: 200,
      sortable: false,
    },
    {
      field: 'businessAddress',
      headerName: 'Business Address',
      disableColumnMenu: true,
      width: 300,
      sortable: false,
    },
    {
      field: 'premisesType',
      headerName: 'Premises',
      disableColumnMenu: true,
      width: 150,
      sortable: false,
    },
    {
      field: 'addressOTP',
      headerName: 'Address OTP',
      disableColumnMenu: true,
      width: 150,
      sortable: false,
    },
    {
      field: 'isVerified',
      headerName: 'Is Address Verified',
      disableColumnMenu: true,
      width: 180,
      sortable: false,
    },
    {
      field: 'download',
      headerName: 'Download PDF',
      disableColumnMenu: true,
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Button
          // variant='contained'
          size='small'
          className='btn btn-outline-primary'
          onClick={() => handleDownloadPDF(params.row.original)}
          sx={{
            backgroundColor: '#355e3b',
            color: '#fff',
            '&:hover': { backgroundColor: '#2a4a2f' },
          }}
        >
          Download PDF
        </Button>
      ),
    },
  ];

  const rows = data.map((item, idx) => ({
    id: idx + 1,
    supplierId: item.supplierProfile?.id || 'N/A',
    supplierName: item.supplierProfile?.supplierName || 'N/A',
    businessName: item.supplierBusinessDetails?.businessName || 'N/A',
    businessAddress: `${item.supplierBusinessDetails?.houseNo || ''}, ${
      item.supplierBusinessDetails?.streetName || ''
    }, ${item.supplierBusinessDetails?.area || ''}, ${
      item.supplierBusinessDetails?.city || ''
    }, ${item.supplierBusinessDetails?.zipcode || ''}, ${
      item.supplierBusinessDetails?.country || ''
    }`,
    premisesType: item.supplierBusinessDetails?.premisesType || 'N/A',
    addressOTP: item.supplierBusinessDetails?.verificationAddressOTP || 'N/A',
    isVerified: item.supplierBusinessDetails?.verifyAddress ? 'Yes' : 'No',
    original: item,
  }));

  if (loading) {
    return (
      <div className='d-flex'>
        <Spinner />
      </div>
    );
  }

  const verifiedSuppliers =
    data.filter((item) => item.supplierBusinessDetails?.verifyAddress).length ||
    0;
  const unverifiedSuppliers = data.length - verifiedSuppliers || 0;
  const cardData = [
    { title: 'Total Suppliers', count: data.length, icon: <Users size={32} /> },
    {
      title: 'Verified Suppliers',
      count: verifiedSuppliers,
      icon: <CheckCircle size={32} color='#4caf50' />,
    },
    {
      title: 'Unverified Suppliers',
      count: unverifiedSuppliers,
      icon: <XCircle size={32} color='#f44336' />,
    },
  ];

  return (
    <Box pt={2}>
      <Grid container spacing={2} mb={3}>
        {cardData.map(({ title, count, icon }) => (
          <Grid item xs={12} sm={4} key={title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: 3,
                backgroundColor: '#e0e2da',
              }}
            >
              <CardContent>
                <Box sx={{ mb: 1 }}>{icon}</Box>
                <Typography
                  variant='h6'
                  sx={{ fontWeight: 'bold' }}
                  className='text-primary'
                >
                  {title}: <span style={{ fontSize: '24px' }}> {count}</span>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Paper
        sx={{ height: 'auto', width: '100%', backgroundColor: '#e2e3df', p: 2 }}
      >
        <h3>Supplier List</h3>
        <Box style={{ width: '100%', marginTop: '2rem' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            componentsProps={{
              loadingOverlay: {
                style: { backgroundColor: '#e2e3df' },
              },
            }}
            isRowSelectable={false}
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#e0e2da',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                // backgroundColor: '#e0e2da',
                fontWeight: '700',
              },
              '& .MuiDataGrid-cell:hover': {
                backgroundColor: '#dbdcd7',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-overlay': {
                backgroundColor: '#e0e2da',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default SupplierList;
