import React, { useState, useEffect, useRef } from "react";

import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Button,
  Paper,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import InvoiceServices from "../../../services/InvoiceService";
import { CreateCustomerProformaInvoice } from './CreateCustomerProformaInvoice';
import { Popup } from './../../../Components/Popup';
import { CustomerProformaInvoice } from './CustomerProformaInvoice';
import AddIcon from "@mui/icons-material/Add";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const ViewCustomerProformaInvoice = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);
  const [idForEdit, setIDForEdit] = useState();
  const errRef = useRef();
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [invoiceData, setInvoiceData] = useState([]);
  useEffect(() => {
    getCustomerPIDetails();
  }, []);

  const getCustomerPIDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getCompanyPerformaInvoiceData();
      setInvoiceData(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      if (!err.response) {
        setErrMsg(
          "“Sorry, You Are Not Allowed to Access This Page” Please contact to admin"
        );
      } else if (err.response.status === 400) {
        setErrMsg(
          err.response.data.errors.name
            ? err.response.data.errors.name
            : err.response.data.errors.non_field_errors
        );
      } else if (err.response.status === 401) {
        setErrMsg(err.response.data.errors.code);
      } else {
        setErrMsg("Server Error");
      }
      errRef.current.focus();
    }
  };



  // const getResetData = () => {
  //   setSearchQuery("");
  //   // getUnits();
  // };

  const openInPopup = (item) => {
    setIDForEdit(item);
    setOpenPopup2(true);
  };

  return (
    <>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Grid item xs={12}>
        <p
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 10,
            borderRadius: 4,
            backgroundColor: errMsg ? "red" : "offscreen",
            textAlign: "center",
            color: "white",
            textTransform: "capitalize",
          }}
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <Paper sx={{ p: 2, m: 4, display: "flex", flexDirection: "column" }}>
          <Box display="flex">
            <Box flexGrow={2}>
              {/* <TextField
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                name="search"
                size="small"
                label="Search"
                variant="outlined"
                sx={{ backgroundColor: "#ffffff" }}
              />
  
              <Button
                // onClick={getSearchData}
                size="medium"
                sx={{ marginLeft: "1em" }}
                variant="contained"
                // startIcon={<SearchIcon />}
              >
                Search
              </Button> */}
              {/* <Button
                // onClick={getResetData}
                sx={{ marginLeft: "1em" }}
                size="medium"
                variant="contained"
              >
                Reset
              </Button> */}
            </Box>
            <Box flexGrow={2}>
              <h3
                style={{
                  textAlign: "left",
                  marginBottom: "1em",
                  fontSize: "24px",
                  color: "rgb(34, 34, 34)",
                  fontWeight: 800,
                }}
              >
               Customer Proforma Invoice Details
              </h3>
            </Box>
            <Box flexGrow={0.5} align="right">
              <Button
                onClick={() => setOpenPopup(true)}
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
              >
                Generate Proforma Invoice
              </Button>
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table
              sx={{ minWidth: 1200 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">COMPANY NAME</StyledTableCell>
                  <StyledTableCell align="center">CONTACT</StyledTableCell>
                  <StyledTableCell align="center">
                    ALT. CONTACT NO.
                  </StyledTableCell>
                  <StyledTableCell align="center">STATUS</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.map((row, i) => {
                  return (
                    <StyledTableRow key={i}>
                      <StyledTableCell align="center">
                        {row.company}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.contact}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.alternate_contact}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.status}
                      </StyledTableCell>
                      <StyledTableCell align="center" >
                      <Button
                          variant="contained"
                          onClick={() => openInPopup(row.pi_number)}
                        >
                          View
                        </Button>
                  
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Popup
        maxWidth={"xl"}
        title={"Create Customer Proforma Invoice"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <CreateCustomerProformaInvoice getCustomerPIDetails={getCustomerPIDetails} setOpenPopup={setOpenPopup} />
      </Popup>
      <Popup
       maxWidth={"xl"}
        title={"View Proforma Invoice"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <CustomerProformaInvoice
        idForEdit={idForEdit}
          setOpenPopup={setOpenPopup2}
        />
      </Popup>
    </>
  );
};
