import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowForwardIosSharp,
  CalendarMonth,
  Description,
  ExpandMore,
  Task
} from '@mui/icons-material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
// import Accordion from "@mui/material/Accordion";
//import { Box, Chip, Tooltip, Typography } from '@mui/material';
import {
  Box,
  Button,
  Select,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import TheFullPageLoader from '../../components/TheFullPageLoader';
import TablePaginationComponent from '../../components/TablePaginationComponent';
import { useTranslation } from 'react-i18next';

function ListView({ legals }) {
  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0
    },
    '&::before': {
      display: 'none'
    }
  }));

  const { t } = useTranslation();

  let [legalsFilters, setLegalsFilters] = useState([]);

  //const legalListLoading = useSelector((state) => state?.fetchListTaskNew?.loading ?? false);
  const legalListLoading = false;
  const [accordionExpanded, setAccordionExpanded] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const pageOption = [10, 20, 50, 100];

  const totalPages = Math.ceil(legalsFilters.length / rowsPerPage);
  const indexOfLastTask = currentPage * rowsPerPage;
  const indexOfFirstTask = indexOfLastTask - rowsPerPage;
  const currentlegals = legalsFilters.slice(indexOfFirstTask, indexOfLastTask);

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
      transform: 'rotate(90deg)'
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: theme.spacing(1)
    }
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)'
  }));

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Back to the first page when change the total pages
  };

  const getCorrectText = (text) => {
    const bytes = new Uint8Array([...text].map((c) => c.charCodeAt(0)));
    const correctText = new TextDecoder('utf-8').decode(bytes);
    return correctText;
  };

  const isSelectedLegal = false;
  const selectedLegal = { id: 1 }; // Example selected legal object

  useEffect(() => {
    let legalsFiltersTemp = legals;

    if (legals.length > 0) {
      if (isSelectedLegal) {
        //legalsFiltersTemp = legalss.filter((item) => item.id === selectedLegal.id);
        setLegalsFilters(legalsFiltersTemp);
      } else {
        setLegalsFilters(legalsFiltersTemp);
      }
    }
  }, [legals, isSelectedLegal, selectedLegal]);

  return (
    <>
      {legalListLoading ? (
        <Box
          sx={{
            width: '100%',
            height: '41rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TheFullPageLoader loaderText="" background="transparent" />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Pagination */}
            <Box sx={{ flexShrink: 0, mb: 2 }}>
              <TablePaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={legalsFilters.length}
                pageSize={rowsPerPage}
                pageOption={pageOption}
                onPageSizeChanged={handleRowsPerPageChange}
                goToPage={goToPage}
              />
            </Box>

            {/* Table wrapper - takes remaining space */}
            <Box
              sx={{
                flexGrow: 1,
                minHeight: 0, // Important for flex child to shrink properly
                overflowY: 'scroll' // Let AgGrid handle its own scrolling
              }}
            >
              {legalsFilters && legalsFilters.length > 0 && (
                <>
                  {currentlegals.map((legal, index) => {
                    return (
                      <Accordion
                        expanded={accordionExpanded[index] || false}
                        style={{ cursor: 'default' }}
                        key={index}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMore fontSize="large" style={{ cursor: 'pointer' }} />}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Box sx={{ width: '70%' }}>
                              <Tooltip title={t('name')} arrow placement="top-start">
                                <Box display="flex" alignItems="center" gap={1} margin="5px 0">
                                  <Task />
                                  <Typography variant="body">{legal.requirement_name}</Typography>
                                </Box>
                              </Tooltip>
                              <Tooltip title={t('description')} arrow placement="bottom-start">
                                <Box display="flex" alignItems="center" gap={1} margin="5px 0">
                                  <Description />
                                  <Typography variant="body">
                                    {legal.requirement_description}
                                  </Typography>
                                </Box>
                              </Tooltip>
                              <Box display="flex" alignItems="center" gap={1} margin="5px 0">
                                <CalendarMonth color="primary" />
                                <Box>
                                  <Tooltip title={t('issue_date')} arrow>
                                    <Typography variant="body" color="primary">
                                      {legal.date_of_issue_notification}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                                <Box>
                                  <Tooltip title={t('execution_date')} arrow>
                                    <Typography variant="body" color="primary">
                                      {legal.effective_date}
                                    </Typography>
                                  </Tooltip>
                                </Box>
                                <Tooltip title={t('type_of_rule')} arrow>
                                  <Chip label={legal.type_of_rule} color="primary" />
                                </Tooltip>
                                <Tooltip title={t('legal_requirement_type')} arrow>
                                  <Chip label={legal.type} color="primary" />
                                </Tooltip>
                              </Box>
                            </Box>
                          </Box>
                        </AccordionSummary>
                      </Accordion>
                    );
                  })}
                </>
              )}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}

export default ListView;
