import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import React, { useState, useEffect, useCallback } from "react";
import InvoiceServices from "../../../services/InvoiceService";
import LeadServices from "../../../services/LeadService";
import ProductService from "../../../services/ProductService";
import { UpdateLeads } from "./../../Leads/UpdateLeads";
import { Popup } from "./../../../Components/Popup";
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));

const tfStyle = {
  "& .MuiButtonBase-root.MuiAutocomplete-clearIndicator": {
    color: "blue",
    visibility: "visible",
  },
};

export const CreateLeadsProformaInvoice = (props) => {
  const { setOpenPopup, getAllLeadsPIDetails } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const [selectedSellerData, setSelectedSellerData] = useState("");
  const [product, setProduct] = useState([]);
  const [leadIDData, setLeadIDData] = useState([]);
  const [paymentTermData, setPaymentTermData] = useState([]);
  const [deliveryTermData, setDeliveryTermData] = useState([]);
  const [leadsOptions, setLeadsOptions] = useState([]);
  const [idForEdit, setIDForEdit] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [products, setProducts] = useState([
    { product: "", quantity: 0, rate: 0, amount: 0, requested_date: 0 },
  ]);

  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name] = event.target.value;
  };

  const addFields = () => {
    let newfield = {
      product: "",
      quantity: 0,
      rate: 0,
      amount: 0,
      requested_date: 0,
    };
    setProducts([...products, newfield]);
  };
  
  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1)
    setProducts(data)
}

  useEffect(() => {
    getAllSellerAccountsDetails();
  }, []);

  const getAllSellerAccountsDetails = async () => {
    try {
      setOpen(true);
      const response = await InvoiceServices.getAllSellerAccountData();
      setSellerData(response.data.results);

      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };


  useEffect(() => {
    getAllleadsData();
  }, [openPopup3]);

  const getAllleadsData = async () => {
    try {
      setOpen(true);
      let response = await LeadServices.getAllLeads();
      setLeadsOptions(response.data.results);
      setOpen(false);
    } catch (err) {
      setOpen(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      setOpen(true);
      const res = await ProductService.getAllPriceList();
      setProduct(res.data.valid_prices);
      setOpen(false);
    } catch (err) {
      console.error("error potential", err);
      setOpen(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await LeadServices.getProfile();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createLeadProformaInvoiceDetails = async (e) => {
    try {
      e.preventDefault();
      const req = {
        type: "lead",
        raised_by: users.email,
        seller_account: selectedSellerData,
        lead: leadIDData.lead_id,
        contact: leadIDData.contact,
        alternate_contact: leadIDData.alternate_contact,
        address: leadIDData.shipping_address,
        pincode: leadIDData.shipping_pincode,
        state: leadIDData.shipping_state,
        city: leadIDData.shipping_city,
        buyer_order_no: inputValue.buyer_order_no,
        buyer_order_date: inputValue.buyer_order_date,
        payment_terms: paymentTermData,
        delivery_terms: deliveryTermData,
        status: "raised",
        products:products,
      };

      console.log("req :>> ", req);
      setOpen(true);
      if (
        leadIDData.contact !== null &&
        leadIDData.address !== null &&
        leadIDData.state !== null &&
        leadIDData.city !== null &&
        leadIDData.pincode !== null &&
        leadIDData.shipping_address !== null &&
        leadIDData.shipping_state !== null &&
        leadIDData.shipping_city !== null &&
        leadIDData.shipping_pincode !== null &&
        (leadIDData.pan_number !== null || leadIDData.gst_number !== null) &&
        leadIDData.company !== null
      ) {
        await InvoiceServices.createLeadsProformaInvoiceData(req);
        setOpenPopup(false);
        getAllLeadsPIDetails();
      } else {
        setIDForEdit(leadIDData.lead_id);
        setLeadIDData([]);
        setOpenPopup2(true);
      }
      setOpen(false);
    } catch (err) {
      if (err.response.status === 400) {
        setErrorMessage(err.response.data.errors.buyer_order_no);
      }
      setOpen(false);
      setLeadIDData([]);
    }
  };

  const openInPopup = () => {
    setOpenPopup3(true);
    setOpenPopup2(false);
    setLeadIDData([]);
    getAllleadsData();
  };

  return (
    <div>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>

      <Box
        component="form"
        noValidate
        onSubmit={(e) => createLeadProformaInvoiceDetails(e)}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Seller Account
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Seller Account"
                onChange={(e, value) => setSelectedSellerData(e.target.value)}
              >
                {sellerData.map((option, i) => (
                  <MenuItem key={i} value={option.gst_number}>
                    {option.state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Payment Terms
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Payment Terms"
                onChange={(e, value) => setPaymentTermData(e.target.value)}
              >
                {paymentTermsOptions.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Delivery Terms
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Delivery Terms"
                onChange={(e, value) => setDeliveryTermData(e.target.value)}
              >
                {deliveryTermsOptions.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="LEAD" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              name="lead"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setLeadIDData(value)}
              options={leadsOptions}
              getOptionLabel={(option) => option.lead_id}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Lead ID" sx={tfStyle} />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="contact"
              size="small"
              label="Contact"
              variant="outlined"
              value={
                leadIDData ? (leadIDData.contact ? leadIDData.contact : "") : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              name="alternate_contact"
              size="small"
              label="Alt. Contact"
              variant="outlined"
              value={
                leadIDData
                  ? leadIDData.alternate_contact
                    ? leadIDData.alternate_contact
                    : ""
                  : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              multiline
              required
              name="address"
              size="small"
              label="Address"
              variant="outlined"
              value={
                leadIDData ? (leadIDData.address ? leadIDData.address : "") : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="city"
              size="small"
              label="City"
              variant="outlined"
              value={leadIDData ? (leadIDData.city ? leadIDData.city : "") : ""}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="state"
              size="small"
              label="State"
              variant="outlined"
              value={
                leadIDData ? (leadIDData.state ? leadIDData.state : "") : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={
                leadIDData ? (leadIDData.pincode ? leadIDData.pincode : "") : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="shipping_address"
              size="small"
              label="Shipping Address"
              variant="outlined"
              value={
                leadIDData
                  ? leadIDData.shipping_address
                    ? leadIDData.shipping_address
                    : ""
                  : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              name="shipping_pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={
                leadIDData
                  ? leadIDData.shipping_pincode
                    ? leadIDData.shipping_pincode
                    : ""
                  : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="shipping_city"
              size="small"
              label="Shipping City"
              variant="outlined"
              value={
                leadIDData
                  ? leadIDData.shipping_city
                    ? leadIDData.shipping_city
                    : ""
                  : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              name="shipping_state"
              size="small"
              label="Shipping State"
              variant="outlined"
              value={
                leadIDData
                  ? leadIDData.shipping_state
                    ? leadIDData.shipping_state
                    : ""
                  : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              required
              type={"number"}
              name="buyer_order_no"
              size="small"
              label="Buyer Order No"
              variant="outlined"
              value={inputValue.buyer_order_no}
              onChange={handleInputChange}
              error={errorMessage}
              helperText={errorMessage}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type={"date"}
              name="buyer_order_date"
              size="small"
              label="Buyer Order Date"
              variant="outlined"
              value={inputValue.buyer_order_date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Root>
              <Divider>
                <Chip label="PRODUCT" />
              </Divider>
            </Root>
          </Grid>
          {products.map((input, index) => {
            return (
              <>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                    Product Name
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="product"
                      label="Product Name"
                      onChange={(event) => handleFormChange(index, event)}
                    >
                      {product.map((option, i) => (
                        <MenuItem key={i} value={option.product}>
                          {option.product}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* <Autocomplete
              style={{
                minWidth: 180,
              }}
              size="small"
              onChange={event => handleFormChange(index, event)}
              name="productName"
              options={product.map((option) => option.product)}
              getOptionLabel={(option) => `${option ? option : "No Options"}`}
              renderInput={(params) => (
                <TextField {...params} label="Product Name" />
              )}
            /> */}
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    // value={input.quantity}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    type={"number"}
                    fullWidth
                    name="rate"
                    size="small"
                    label="Rate"
                    variant="outlined"
                    // value={input.rate}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type={"number"}
                    name="amount"
                    size="small"
                    label="Amount"
                    variant="outlined"
                    // value={input.amount}
                    onChange={(event) => handleFormChange(index, event)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type={"date"}
                    name="requested_date"
                    size="small"
                    label="Request Date"
                    variant="outlined"
                    value={input.requested_date}
                    onChange={(event) => handleFormChange(index, event)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} alignContent="right">
                  <Button onClick={addFields} variant="contained" sx={{marginRight:'1em'}}>
                    Add More...
                  </Button>
                  {index !== 0 &&
                  <Button disabled={index === 0} onClick={() => removeFields(index)} variant="contained">
                  Remove
                  </Button>}
                </Grid>
              </>
            );
          })}
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
      <Popup
        maxWidth={"xl"}
        title={"Update Lead Details"}
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <Typography>
          Kindly update all Shipping Details & Laeds Details in required field
        </Typography>
        <Button variant="contained" onClick={() => openInPopup()}>
          Update Leads
        </Button>
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <UpdateLeads
          getAllleadsData={getAllleadsData}
          recordForEdit={idForEdit}
          setOpenPopup={setOpenPopup3}
        />
      </Popup>
    </div>
  );
};

const paymentTermsOptions = [
  { label: "100% Advance", value: "100%_advance" },
  {
    label: "50% Advance, Balance Before Dispatch",
    value: "50%_advance_balance_before_dispatch",
  },
  {
    label: "30% Advance, Balance Before Dispatch",
    value: "30%_advance_balance_before_dispatch",
  },
  { label: "15 days along with PDC", value: "15_days_with_pdc" },
  { label: "30 days along with PDC", value: "30_days_with_pdc" },
  { label: "45 days along with PDC", value: "45_days_with_pdc" },
  { label: "60 days along with PDC", value: "60_days_with_pdc" },
  { label: "7 days", value: "7_days" },
  { label: "15 days", value: "15_days" },
  { label: "30 days", value: "30_days" },
  {
    label: "10% Advance, balance against shipping document (export)",
    value: "10%_advance_balance_against_shipping_document_(export)",
  },
  {
    label: "20% Advance, balance against shipping document (export)",
    value: "20%_advance_balance_against_shipping_document_(export)",
  },
  {
    label: "30% Advance, balance against shipping document (export)",
    value: "30%_advance_balance_against_shipping_document_(export)",
  },
  {
    label: "40% Advance, balance against shipping document (export)",
    value: "40%_advance_balance_against_shipping_document_(export)",
  },
  {
    label: "50% Advance, balance against shipping document (export)",
    value: "50%_advance_balance_against_shipping_document_(export)",
  },
  { label: "LC at Sight (Export)", value: "lc_at_sight_(export)" },
  { label: "LC 45 days (Export)", value: "lc_45_days_(export)" },
  { label: "TT in advance (Export)", value: "tt_in_advance_(export)" },
];

const deliveryTermsOptions = [
  {
    label: "Ex-Work (Freight to pay)",
    value: "ex_work_(freight_to_pay)",
  },
  {
    label: "Transporter Warehouse (Freight to Pay)",
    value: "transporter_warehouse_(freight_to_pay)",
  },
  {
    label: "Customer Door Delivery (Freight to Pay)",
    value: "customer_door_delivery_(freight_to_pay)",
  },
  {
    label: "Customer Door Delivery (Freight to Prepaid)",
    value: "customer_door_delivery_(freight_to_pay)",
  },
  {
    label: "Add actual freight in invoice",
    value: "add_actual_freight_in_invoice",
  },
  {
    label: "Courier (Freight to Pay)",
    value: "courier_(freight_to_pay)",
  },
  {
    label: "Courier (Freight Add in Invoice)",
    value: "courier_(freight_add_in_invoice",
  },
];
