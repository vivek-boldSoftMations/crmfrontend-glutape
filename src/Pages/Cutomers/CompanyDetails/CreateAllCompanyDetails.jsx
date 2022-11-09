import React, { useState } from "react";
// import { BankDetails } from "../BankDetails/BankDetails";

import {
  Box,
  useTheme,
  Tab,
  Tabs,
  AppBar,
} from "@mui/material";
import PropTypes from "prop-types";
// import { ContactDetails } from "../ContactDetails/ContactDetails";
// import { WareHouseDetails } from "../WareHouseDetails/WareHouseDetails";
import { UpdateCompanyDetails } from "./UpdateCompanyDetails";
// import { SecurityChequesDetails } from "./../SecurityCheckDetails/SecurityChequesDetails";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export const CreateAllCompanyDetails = (props) => {
  const { setOpenPopup, getAllCompanyDetails, recordForEdit } = props;
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Company" {...a11yProps(0)} />
          <Tab label="Bank" {...a11yProps(1)} />
          <Tab label="Contact" {...a11yProps(2)} />
          <Tab label="WareHouse" {...a11yProps(3)} />
          <Tab label="Security Cheques" {...a11yProps(4)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <UpdateCompanyDetails
          setOpenPopup={setOpenPopup}
          getAllCompanyDetails={getAllCompanyDetails}
          recordForEdit={recordForEdit}
        />
      </TabPanel>
      {/* <TabPanel value={value} index={1} dir={theme.direction}>
        <BankDetails recordForEdit={recordForEdit} />
      </TabPanel> */}
      {/* <TabPanel value={value} index={2} dir={theme.direction}>
        <ContactDetails recordForEdit={recordForEdit} />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <WareHouseDetails recordForEdit={recordForEdit} />
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        <SecurityChequesDetails recordForEdit={recordForEdit} />
      </TabPanel> */}
    </div>
  );
};
