import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
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
import { Popup } from "./../../../Components/Popup";
import CustomerServices from "../../../services/CustomerService";
import { UpdateCompanyDetails } from "../../Cutomers/CompanyDetails/UpdateCompanyDetails";
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

const values = {
  someDate: new Date().toISOString().substring(0, 10),
};

export const CreateCustomerProformaInvoice = (props) => {
  const { setOpenPopup, getCustomerPIDetails } = props;
  const [openPopup2, setOpenPopup2] = useState(false);
  const [openPopup3, setOpenPopup3] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState([]);
  const [users, setUsers] = useState([]);
  const [sellerData, setSellerData] = useState([]);
  const [selectedSellerData, setSelectedSellerData] = useState("");
  const [product, setProduct] = useState([]);
  const [paymentTermData, setPaymentTermData] = useState([]);
  const [deliveryTermData, setDeliveryTermData] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [contactData, setContactData] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [idForEdit, setIDForEdit] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [checked, setChecked] = React.useState(true);
  const [products, setProducts] = useState([
    {
      product: "",
      quantity: 0,
      rate: 0,
      amount: 0,
      requested_date: values.someDate,
    },
  ]);
  const handleFormChange = (index, event) => {
    let data = [...products];
    data[index][event.target.name] = event.target.value;
    setProducts(data);
  };

  const addFields = () => {
    let newfield = {
      product: "",
      quantity: 0,
      rate: 0,
      amount: 0,
      requested_date: values.someDate,
    };
    setProducts([...products, newfield]);
  };

  const removeFields = (index) => {
    let data = [...products];
    data.splice(index, 1);
    setProducts(data);
  };

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
      let response = await CustomerServices.getAllCompanyData();
      setCompanyOptions(response.data.results);
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


  const createCustomerProformaInvoiceDetails = async (e) => {
    try {
      e.preventDefault();
      const req = {
        type: "customer",
        raised_by: users.email,
        seller_account: selectedSellerData,
        company: companyData.name,
        contact: contactData.contact,
        alternate_contact: contactData.alternate_contact,
        address: warehouseData.address,
        pincode: warehouseData.pincode,
        state: warehouseData.state,
        city: warehouseData.city,
        buyer_order_no: checked === true ? "Verbal" : inputValue.buyer_order_no,
        buyer_order_date: inputValue.buyer_order_date,
        payment_terms: paymentTermData,
        delivery_terms: deliveryTermData,
        status: "raised",
        // amount: Amount,
        products: products,
      };

      console.log("req :>> ", req);
      setOpen(true);
      if (
        contactData.contact !== null &&
        warehouseData.address !== null &&
        warehouseData.state !== null &&
        warehouseData.city !== null &&
        warehouseData.pincode !== null
      ) {
        await InvoiceServices.createCustomerProformaInvoiceData(req);
        setOpenPopup(false);
        getCustomerPIDetails();
      } else {
        setIDForEdit(companyData.id);
        setCompanyData([]);
        setOpenPopup2(true);
      }
      setOpen(false);
    } catch (err) {
      if (err.response.status === 400) {
        setErrorMessage(err.response.data.errors.buyer_order_no);
      }
      // setIDForEdit(leadIDData.lead_id);
      setOpen(false);
      setCompanyData([]);
      // setOpenPopup2(true);
    }
  };

  const openInPopup = () => {
    setOpenPopup3(true);
    setOpenPopup2(false);
    setCompanyData([]);
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
        // onSubmit={formik.handleSubmit}
        onSubmit={(e) => createCustomerProformaInvoiceDetails(e)}
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
            {/* <TextField
              fullWidth
              name="seller_account"
              size="small"
              label="Seller Account"
              variant="outlined"
              value={inputValue.seller_account}
              onChange={handleInputChange}
            /> */}
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
                <Chip label="CUSTOMER" />
              </Divider>
            </Root>
          </Grid>
          <Grid item xs={12} sm={4}>
          <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Company Name
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Company Name"
                onChange={(e, value) => setCompanyData(e.target.value)}
              >
                {companyOptions.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <Autocomplete
              name="name"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setCompanyData(value)}
              options={companyOptions}
              getOptionLabel={(option) => option.name}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Company Name" sx={tfStyle} />
              )}
            /> */}
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              name="contact"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setContactData(value)}
              options={companyData.contacts}
              getOptionLabel={(option) => option.contact}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Contact" sx={tfStyle} />
              )}
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
                contactData
                  ? contactData.alternate_contact
                    ? contactData.alternate_contact
                    : ""
                  : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              name="address"
              size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setWarehouseData(value)}
              options={companyData.warehouse}
              getOptionLabel={(option) => option.address}
              sx={{ minWidth: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Address" sx={tfStyle} />
              )}
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
              value={
                warehouseData
                  ? warehouseData.city
                    ? warehouseData.city
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
              name="state"
              size="small"
              label="State"
              variant="outlined"
              value={
                warehouseData
                  ? warehouseData.state
                    ? warehouseData.state
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
              name="pincode"
              size="small"
              type={"number"}
              label="Pin Code"
              variant="outlined"
              value={
                warehouseData
                  ? warehouseData.pincode
                    ? warehouseData.pincode
                    : ""
                  : ""
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              label="Verbal"
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                />
              }
            />

            <TextField
              required
              name="buyer_order_no"
              size="small"
              label="Buyer Order No"
              variant="outlined"
              disabled={checked === true}
              value={checked === true ? "Verbal" : inputValue.buyer_order_no}
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
              value={
                inputValue.buyer_order_date
                  ? inputValue.buyer_order_date
                  : values.someDate
              }
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
                        <MenuItem key={i} value={option}>
                          {option.product}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="quantity"
                    size="small"
                    label="Quantity"
                    variant="outlined"
                    value={input.quantity}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {input.product ? input.product.unit : ""}
                        </InputAdornment>
                      ),
                    }}
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
                    value={
                      input.requested_date
                        ? input.requested_date
                        : values.someDate
                    }
                    onChange={(event) => handleFormChange(index, event)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} alignContent="right">
                  <Button
                    onClick={addFields}
                    variant="contained"
                    sx={{ marginRight: "1em" }}
                  >
                    Add More...
                  </Button>
                  {index !== 0 && (
                    <Button
                      disabled={index === 0}
                      onClick={() => removeFields(index)}
                      variant="contained"
                    >
                      Remove
                    </Button>
                  )}
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
          Kindly update all required field WareHouse Details in Company
        </Typography>
        <Button variant="contained" onClick={() => openInPopup()}>
          Update Company Details
        </Button>
      </Popup>
      <Popup
        maxWidth={"xl"}
        title={"Update Leads"}
        openPopup={openPopup3}
        setOpenPopup={setOpenPopup3}
      >
        <UpdateCompanyDetails
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
