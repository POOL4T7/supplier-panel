import axios from "axios";
import { Mail, MapPinHouse, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Spinner from "../components/common/Spinner";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = JSON.parse(query);
        const res = await axios.post(
          `/proxy/productsearchsupplier/search`,
          data
        );
        setProductList(res.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    if (query) fetchData();
  }, [query]);

  if (loading) {
    return (
      <div style={{ marginTop: "6rem" }} className="d-flex">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: "6rem" }}>
      <div className="row">
        {/* Left Column - Search Results */}
        <div className="col-12 col-md-8">
          {productList?.length === 0 && (
            <div className="d-flex justify-content-center">
              <h4>No Product found?</h4>
            </div>
          )}
          {productList.map((item, idx) => (
            <div
              className="card p-3 shadow-sm border-0 col-12 mb-3"
              key={idx}
              style={{ backgroundColor: "#d3d7c8" }}
            >
              <div className="row">
                <div className="col-12 col-md-3">
                  <div className="row">
                    <div className="col-6 col-md-12">
                      <img
                        src="/images/logo.webp"
                        alt="Company Logo"
                        className="me-3"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </div>
                    <div className="col-6 col-md-12">
                      <p className="small mb-1">
                        <Truck size={15} /> {"  "}
                        <span className="fw-bold">
                          {item.supplierBusinessDetails.country || "Germany"}
                        </span>
                      </p>

                      <p className="small mb-1">
                        <Mail size={15} /> {"  "}
                        {item.supplierBusinessDetails.email ||
                          "abdfv@gmail.com"}
                      </p>
                      <div className="ms-auto">
                        <MapPinHouse size={15} />{" "}
                        <span className="small">
                          {item.supplierBusinessDetails.city}{" "}
                          {item.supplierBusinessDetails.country} usa, gernamuy
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-9">
                  <h3 className="fw-bold text-primary d-flex">
                    {item.supplierBusinessDetails.businessName}
                  </h3>
                  <p className="mt-3 small">
                    {/* {item.supplierBusinessDetails.aboutUs ||
                      "About is not available"} */}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry`s
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                  </p>
                  <div className="d-flex overflow-auto">
                    {Object.keys(item.matchedSearchTermNames).map(
                      (key) =>
                        item?.matchedSearchTermNames[key]?.length > 0 && (
                          <div key={key} className="mb-1 d-flex flex-wrap">
                            <h5>{key.replace(/([A-Z])/g, " $1")}: </h5>
                            {item.matchedSearchTermNames[key]
                              .slice(0, 4)
                              .map((item, index) => (
                                <span
                                  key={index}
                                  className="badge rounded-pill bg-primary px-2 py-1 text-white m-1"
                                  style={{ cursor: "pointer" }}
                                >
                                  {item}
                                </span>
                              ))}
                          </div>
                        )
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-end align-items-end h-100">
                  <a
                    href={`/supplier-details?id=${item.supplierBusinessDetails.id}`}
                    className="text-success fw-bold"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Filters (Fixed) */}
        <div className="col-12 col-md-4">
          <div
            className="d-none d-md-block position-sticky top-0 p-3 shadow-sm border rounded"
            style={{ backgroundColor: "#d2d8c8" }}
          >
            <h5 className="fw-bold">Filters</h5>
            {/* Add filter options here */}
            <p>Coming soon..</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
