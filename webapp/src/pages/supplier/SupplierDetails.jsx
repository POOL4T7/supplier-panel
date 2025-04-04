import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosInstance from '../../axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Collapse,
  Rating,
  Stack,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebIcon,
  Facebook as FacebookIcon,
  WhatsApp as WhatsAppIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
  Store as StoreIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import Spinner from '../../components/common/Spinner';

const SupplierDetails = () => {
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const supplierBusinessId = searchParams.get('id');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [textRef, setTextRef] = useState(null);
  const [showMoreButton, setShowMoreButton] = useState(false);

  // Theme colors
  const theme = createTheme({
    palette: {
      background: {
        default: '#f4f6f1',
        paper: '#e8eae3',
      },
      primary: {
        main: '#4b6043',
        light: '#6b8063',
        dark: '#2b4023',
      },
      success: {
        main: '#5a7152',
      },
    },
  });

  useEffect(() => {
    if (supplierBusinessId) {
      axiosInstance
        .get(
          `/proxy/productsearch/api/supplier/file/getBusinessProfileDetailsForSupplier?supplierBusinessId=${supplierBusinessId}`
        )
        .then((response) => {
          setSupplierData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching supplier details:', error);
          setLoading(false);
        });
    }
  }, [supplierBusinessId]);

  useEffect(() => {
    if (textRef && supplierData?.aboutUs) {
      const lineHeight = parseInt(window.getComputedStyle(textRef).lineHeight);
      const height = textRef.scrollHeight;
      const lines = height / lineHeight;
      setShowMoreButton(lines > 3);
    }
  }, [textRef, supplierData?.aboutUs]);

  const getTextStyles = (showFull) => ({
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: showFull ? 'unset' : 3,
  });

  if (loading)
    return (
      <ThemeProvider theme={theme}>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='calc(100vh - 6rem)'
          mt={8}
          sx={{ backgroundColor: 'background.default' }}
        >
          <Spinner />
        </Box>
      </ThemeProvider>
    );

  if (!supplierData)
    return (
      <ThemeProvider theme={theme}>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='calc(100vh - 6rem)'
          mt={8}
          sx={{ backgroundColor: 'background.default' }}
        >
          <Box textAlign='center'>
            <img
              src='/images/not-found.webp'
              alt='Not Found'
              style={{ width: '200px', marginBottom: '1rem' }}
            />
            <Typography variant='h5' color='text.secondary'>
              Supplier details not found
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth='lg' sx={{ pt: 10, pb: 4 }}>
          <Grid container spacing={3}>
            {/* Main Content */}
            <Grid item xs={12} md={9}>
              {/* Profile Card */}
              <Card
                sx={{
                  mb: 3,
                  position: 'relative',
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {/* Cover Image */}
                <CardMedia
                  component='div'
                  sx={{
                    height: 350,
                    backgroundColor: '#e0e2da',
                    position: 'relative',
                  }}
                >
                  <img
                    src={
                      supplierData.businessImage || '/images/placeholder.webp'
                    }
                    alt='Business Cover'
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {/* Logo */}
                  <Avatar
                    src={supplierData.businessLogo || '/images/logo.webp'}
                    sx={{
                      width: 120,
                      height: 120,
                      position: 'absolute',
                      bottom: -60,
                      left: 24,
                      border: '4px solid',
                      borderColor: 'background.paper',
                      boxShadow: 2,
                    }}
                  />
                </CardMedia>

                <CardContent
                  sx={{ pt: 8, backgroundColor: 'background.paper' }}
                >
                  {/* Business Name and Verification */}
                  <Box display='flex' alignItems='center' mb={2}>
                    <Typography variant='h4' component='h1' fontWeight='bold'>
                      {supplierData.businessName}
                    </Typography>
                    <VerifiedIcon color='primary' sx={{ ml: 1 }} />
                  </Box>

                  {/* Business Type and Rating */}
                  <Box display='flex' alignItems='center' mb={2}>
                    <StoreIcon color='action' sx={{ mr: 1 }} />
                    <Typography variant='subtitle1' color='text.secondary'>
                      {supplierData.businessType}
                    </Typography>
                    <Rating
                      value={4.5}
                      precision={0.5}
                      readOnly
                      size='small'
                      sx={{ ml: 2 }}
                    />
                  </Box>

                  {/* Address */}
                  <Box display='flex' mb={2}>
                    <LocationIcon color='action' sx={{ mr: 1, mt: 0.5 }} />
                    <Typography color='text.secondary'>
                      {[
                        supplierData.street,
                        supplierData.area,
                        supplierData.businessCity,
                        supplierData.businessCountry,
                        supplierData.businessZipCode,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </Typography>
                  </Box>

                  {/* Description */}
                  {supplierData.aboutUs && (
                    <Box>
                      <Typography
                        ref={(el) => setTextRef(el)}
                        color='text.secondary'
                        paragraph
                        sx={{
                          mt: 2,
                          ...getTextStyles(showFullAbout),
                          transition: 'all 0.3s ease-out',
                        }}
                      >
                        {supplierData.aboutUs}
                      </Typography>
                      {showMoreButton && (
                        <Button
                          size='small'
                          onClick={() => setShowFullAbout(!showFullAbout)}
                          sx={{
                            mt: -1,
                            color: 'text.secondary',
                            '&:hover': {
                              backgroundColor: 'transparent',
                              color: 'primary.main',
                            },
                          }}
                        >
                          {showFullAbout ? 'Show Less' : 'Show More'}
                        </Button>
                      )}
                    </Box>
                  )}

                  {/* Contact Buttons */}
                  <Stack
                    direction='row'
                    spacing={1}
                    flexWrap='wrap'
                    sx={{ mt: 3 }}
                  >
                    {supplierData.phoneNumber && (
                      <Button
                        variant='contained'
                        startIcon={<PhoneIcon />}
                        href={`tel:${supplierData.phoneNumber}`}
                        sx={{ mb: 1 }}
                      >
                        Call Now
                      </Button>
                    )}
                    {supplierData.whatsapp && (
                      <Button
                        variant='contained'
                        color='success'
                        startIcon={<WhatsAppIcon />}
                        href={`https://wa.me/${supplierData.whatsapp}`}
                        target='_blank'
                        sx={{ mb: 1 }}
                      >
                        WhatsApp
                      </Button>
                    )}
                    {supplierData.email && (
                      <Button
                        variant='outlined'
                        startIcon={<EmailIcon />}
                        href={`mailto:${supplierData.email}`}
                        sx={{ mb: 1 }}
                      >
                        Email
                      </Button>
                    )}
                    {supplierData.webSite && (
                      <Button
                        variant='outlined'
                        startIcon={<WebIcon />}
                        href={supplierData.webSite}
                        target='_blank'
                        sx={{ mb: 1 }}
                      >
                        Website
                      </Button>
                    )}
                    {supplierData.facebookUrl && (
                      <Button
                        variant='outlined'
                        startIcon={<FacebookIcon />}
                        href={supplierData.facebookUrl}
                        target='_blank'
                        sx={{ mb: 1 }}
                      >
                        Facebook
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Categories Section */}
              <Paper
                sx={{
                  mb: 3,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Box
                  p={2}
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant='h6' fontWeight='medium'>
                    Categories
                  </Typography>
                  <IconButton
                    sx={{
                      transform: isCategoryOpen ? 'rotate(180deg)' : 'none',
                      transition: '0.3s',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={isCategoryOpen}>
                  <Box p={2} pt={0}>
                    <Stack direction='row' spacing={1} flexWrap='wrap'>
                      {supplierData.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          variant='outlined'
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Collapse>
              </Paper>

              {/* Services Section */}
              <Paper
                sx={{
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <Box
                  p={2}
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                  onClick={() => setIsSubCategoryOpen(!isSubCategoryOpen)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Typography variant='h6' fontWeight='medium'>
                    Services
                  </Typography>
                  <IconButton
                    sx={{
                      transform: isSubCategoryOpen ? 'rotate(180deg)' : 'none',
                      transition: '0.3s',
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={isSubCategoryOpen}>
                  <Box p={2} pt={0}>
                    <Stack direction='row' spacing={1} flexWrap='wrap'>
                      {supplierData.subCategories.map((service, index) => (
                        <Chip
                          key={index}
                          label={service}
                          variant='outlined'
                          color='primary'
                          sx={{ m: 0.5 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Collapse>
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={3}>
              {/* Featured Ads */}
              <Card
                sx={{
                  mb: 3,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <CardContent>
                  <Typography variant='h6' fontWeight='medium' gutterBottom>
                    Featured Ads
                  </Typography>
                  <Stack spacing={2}>
                    {[1, 2, 3].map((item) => (
                      <Paper
                        key={item}
                        sx={{
                          overflow: 'hidden',
                          transition: '0.3s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 2,
                          },
                        }}
                      >
                        <CardMedia
                          component='img'
                          height='140'
                          image='/images/placeholder.webp'
                          alt={`Advertisement ${item}`}
                        />
                        <Box p={1.5}>
                          <Typography variant='subtitle2' fontWeight='medium'>
                            Advertisement Title {item}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            Short description of the advertisement
                          </Typography>
                        </Box>
                      </Paper>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default SupplierDetails;
