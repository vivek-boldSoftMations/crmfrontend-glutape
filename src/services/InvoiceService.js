import CustomAxios from "./api";


const getAllSellerAccountData = () => {
  return CustomAxios.get(`/api/invoice/list-seller-account`);
};

const getAllSearchSellerAccountData = (search) => {
  return CustomAxios.get(`/api/invoice/list-seller-account/?search=${search}`);
};

const getAllSellerAccountDataPaginate = (currentPage, search) => {
  return CustomAxios.get(
    `/api/ invoice/list-seller-account/?page=${currentPage}&search=${search}`
  );
};

const createSellerAccountData = (data) => {
  return CustomAxios.post("/api/invoice/list-seller-account/", data);
};

const getSellerAccountDataById = (id) => {
  return CustomAxios.get(`/api/invoice/list-seller-account/${id}`);
};

const updateSellerAccountData = (id, data) => {
  return CustomAxios.patch(`/api/invoice/list-seller-account/${id}`, data);
};

const getCompanyPerformaInvoiceData = () => {
  return CustomAxios.get(`/api/invoice/list-company-pi`);
};

const getLeadsPerformaInvoiceData = () => {
  return CustomAxios.get(`/api/invoice/list-lead-pi`);
};

const getCompanyPerformaInvoiceByIDData = (id) => {
  return CustomAxios.get(`/api/invoice/list-company-pi/${id}`);
};

const getLeadsPerformaInvoiceByIDData = (id) => {
  return CustomAxios.get(`/api/invoice/list-lead-pi/${id}`);
};

const sendForApprovalCompanyData = (id,data) => {
  return CustomAxios.patch(`/api/invoice/list-company-pi/${id}`, data);
};

const sendForApprovalLeadsData = (id,data) => {
  return CustomAxios.patch(`/api/invoice/list-lead-pi/${id}`, data);
};

const createLeadsProformaInvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/list-lead-pi/", data);
};

const createCustomerProformaInvoiceData = (data) => {
  return CustomAxios.post("/api/invoice/list-company-pi/", data);
};
 const InvoiceServices = {
    getAllSellerAccountData,
    getAllSearchSellerAccountData,
    getAllSellerAccountDataPaginate,
    createSellerAccountData,
    getSellerAccountDataById,
    updateSellerAccountData,
    getCompanyPerformaInvoiceData,
    getLeadsPerformaInvoiceData,
    getCompanyPerformaInvoiceByIDData,
    getLeadsPerformaInvoiceByIDData,
    sendForApprovalCompanyData,
    sendForApprovalLeadsData,
    createLeadsProformaInvoiceData,
    createCustomerProformaInvoiceData
};

export default InvoiceServices;