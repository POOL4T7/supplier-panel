import { useState, useEffect } from "react";
import axios from "axios";

const supplierBussinessProfile = () => {
  const [loading, setLoading] = useState(false);
  const [supplierDetails, setSupplierDetails] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = axios.get("/api/");
        console.log(res)
      } catch (e) {
        console.log(e);
      }
    }
  }, []);
  return {
    loading,
    supplierDetails,
  };
};

export default supplierBussinessProfile;
