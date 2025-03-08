import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import axiosInstance from '../../axios';
import Spinner from '../../components/common/Spinner';

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

  if (loading) {
    return (
      <div className='d-flex'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='table-responsive mt-3'>
      <h1 className='mt-2'>Supplier List</h1>
      <table className='table table-hover table-bordered shadow-sm table-sm'>
        <thead className='table-light'>
          <tr>
            <th scope='col'>S.no.</th>
            <th scope='col'>Supplier ID</th>
            <th scope='col'>Supplier Name</th>
            <th scope='col'>Business Name</th>
            <th scope='col'>Business Address</th>
            <th scope='col'>Premises</th>
            <th scope='col'>Address OTP</th>
            <th scope='col'>isAddress Verified</th>
            <th scope='col'>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={item.id}>
              <th scope='row'>{idx + 1}</th>
              <td>{item.supplierProfile?.id}</td>
              <td>{item.supplierProfile?.supplierName}</td>
              <td>{item.supplierBusinessDetails?.businessName}</td>
              <td>
                {item.supplierBusinessDetails?.houseNo},{' '}
                {item.supplierBusinessDetails?.streetName},{' '}
                {`${item.supplierBusinessDetails?.area || ''}, ${
                  item.supplierBusinessDetails?.city || ''
                }`}
                {`${item.supplierBusinessDetails?.zipcode || ''}, ${
                  item.supplierBusinessDetails?.country || ''
                }`}
              </td>
              <td>{item.supplierBusinessDetails?.premisesType}</td>
              <td>{item.supplierBusinessDetails?.verificationAddressOTP}</td>
              <td>{`${item.supplierBusinessDetails?.verifyAddress}`}</td>
              <td>
                <button
                  className='btn btn-sm btn-primary'
                  onClick={() => handleDownloadPDF(item)}
                >
                  Download PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierList;
