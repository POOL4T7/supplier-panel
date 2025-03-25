import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Drawer,
  Button,
  Box,
  IconButton,
  Typography,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useTheme,
  Stack,
} from '@mui/material';
import {
  X,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  ChevronUp,
  // Combine,
} from 'lucide-react';

const RightDrawer = ({ structure }) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  const theme = useTheme();

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const handleToggle = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      {/* Floating action button with vertical text */}
      {!open && (
        <button
          // variant='contained'
          onClick={toggleDrawer(true)}
          style={{
            position: 'fixed',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            // borderRadius: '30px 0 0 30px',
            zIndex: 1300,
            boxShadow: theme.shadows[4],
            padding: '20px',
            width: '25px', // Thinner width
            backgroundColor: '#012908',
            '&:hover': {
              backgroundColor: '#000b02',
            },
            color: 'white',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          {/* <Combine size={20} /> */}
          <Box sx={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
            <Typography variant='button' sx={{ fontSize: '0.75rem' }}>
              Your Shop
            </Typography>
          </Box>
        </button>
      )}

      {/* Enhanced Drawer */}
      <Drawer
        anchor='right'
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: { xs: '90vw', sm: 450 },
            background: '#e0e2da',
            boxShadow: theme.shadows[16],
          },
        }}
      >
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          role='presentation'
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: '#012908',
              color: theme.palette.primary.contrastText,
            }}
          >
            <Typography variant='h6' sx={{ fontWeight: 600, color: 'white' }}>
              Business Categories
            </Typography>
            <IconButton
              onClick={toggleDrawer(false)}
              sx={{ color: theme.palette.primary.contrastText }}
            >
              <X />
            </IconButton>
          </Box>

          {/* Content */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.action.hover,
                borderRadius: '3px',
              },
            }}
          >
            <List disablePadding>
              {structure?.map((desc, idx) => (
                <Box key={desc.businessDescription} sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleToggle(idx)}
                    sx={{
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {expanded[idx] ? (
                        <FolderOpen fontSize='small' />
                      ) : (
                        <Folder fontSize='small' />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={desc.businessDescription}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        color: '#012908',
                      }}
                    />
                    {expanded[idx] ? <ChevronUp /> : <ChevronDown />}
                  </ListItemButton>

                  <Collapse in={expanded[idx]} timeout='auto' unmountOnExit>
                    <List disablePadding sx={{ pl: 3 }}>
                      {desc.categories.map((cate, cateIdx) => (
                        <Box key={cate.categoryName} sx={{ mb: 0.5 }}>
                          <ListItemButton
                            onClick={() => handleToggle(`${idx}-${cateIdx}`)}
                            sx={{
                              borderRadius: 1,
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover,
                              },
                            }}
                          >
                            <ListItemText
                              primary={cate.categoryName}
                              sx={{ pl: 1 }}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                            {expanded[`${idx}-${cateIdx}`] ? (
                              <ChevronDown fontSize='small' />
                            ) : (
                              <ChevronRight fontSize='small' />
                            )}
                          </ListItemButton>

                          <Collapse
                            in={expanded[`${idx}-${cateIdx}`]}
                            timeout='auto'
                            unmountOnExit
                          >
                            <Box sx={{ pl: 4, py: 1 }}>
                              {cate.subCategories.length > 0 ? (
                                <Stack
                                  direction='row'
                                  flexWrap='wrap'
                                  gap={1}
                                  sx={{ pl: 1 }}
                                >
                                  {cate.subCategories.map((subCate, subIdx) => (
                                    <Chip
                                      key={subIdx}
                                      label={
                                        <>
                                          {subCate.subCategoryName}
                                          {subCate.count && (
                                            <Typography
                                              component='span'
                                              sx={{
                                                fontSize: '0.7em',
                                                ml: 0.5,
                                                opacity: 0.8,
                                              }}
                                            >
                                              ({subCate.count})
                                            </Typography>
                                          )}
                                        </>
                                      }
                                      size='small'
                                      sx={{
                                        borderRadius: 1,
                                        backgroundColor:
                                          theme.palette.action.selected,
                                        '& .MuiChip-label': {
                                          display: 'flex',
                                          alignItems: 'center',
                                        },
                                      }}
                                    />
                                  ))}
                                </Stack>
                              ) : (
                                <Typography
                                  variant='caption'
                                  color='text.disabled'
                                  sx={{
                                    pl: 2,
                                    display: 'block',
                                    fontStyle: 'italic',
                                  }}
                                >
                                  No subcategories
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </Box>
                      ))}
                    </List>
                  </Collapse>
                  <Divider sx={{ my: 1 }} />
                </Box>
              ))}
            </List>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              textAlign: 'center',
            }}
          >
            <Button
              variant='outlined'
              onClick={toggleDrawer(false)}
              startIcon={<X size={18} />}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default RightDrawer;

RightDrawer.propTypes = {
  structure: PropTypes.arrayOf(
    PropTypes.shape({
      businessDescription: PropTypes.string.isRequired,
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          categoryName: PropTypes.string.isRequired,
          subCategories: PropTypes.arrayOf(
            PropTypes.shape({
              subCategoryName: PropTypes.string.isRequired,
              count: PropTypes.number,
            })
          ),
        })
      ),
    })
  ).isRequired,
};
