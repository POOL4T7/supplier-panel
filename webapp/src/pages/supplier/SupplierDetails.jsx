import { useRef, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../../axios";
import { SquareArrowOutUpRight, Menu, X } from "lucide-react";
import Spinner from "../../components/common/Spinner";
import { User, MapPin, List, Briefcase, Link as LinkIcon } from "lucide-react";

const SupplierDetails = () => {
  const [supplierData, setSupplierData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const supplierBusinessId = searchParams.get("id");
  const [activeSection, setActiveSection] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Add screen size listener
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          console.error("Error fetching supplier details:", error);
          setLoading(false);
        });
    }
  }, [supplierBusinessId]);

  const profileRef = useRef(null);
  const addressRef = useRef(null);
  const productsRef = useRef(null);
  const servicesRef = useRef(null);
  const connectRef = useRef(null);

  const handleScroll = (ref, section) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(section);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "6rem" }}
      >
        <Spinner />
      </div>
    );

  if (!supplierData)
    return (
      <div className="container" style={{ marginTop: "6rem" }}>
        <p>Supplier details not found.</p>
      </div>
    );

  return (
    <div className="container-fluid px-0" style={{ marginTop: "6rem" }}>
      {/* Mobile Menu Toggle - Only show on mobile */}
      {isMobile && (
        <button
          className="btn btn-light position-fixed"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            top: "75px",
            right: "15px",
            zIndex: 1040,
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      <div className="row g-0">
        {/* Overlay for mobile only */}
        {isMobile && isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1030,
            }}
          />
        )}

        {/* Modified Sidebar */}
        <div
          className={`col-md-3 position-fixed ${
            isMobile ? (isSidebarOpen ? "d-block" : "d-none") : "d-block"
          }`}
          style={{
            height: "100vh",
            overflowY: "auto",
            maxWidth: "280px",
            backgroundColor: "#cdcfc7",
            padding: "20px",
            boxShadow: "2px 0 10px #acafa5",
            zIndex: 1035,
            top: 0,
            left: 0,
            paddingTop: "80px",
            transition: "transform 0.3s ease-in-out",
            transform:
              isMobile && !isSidebarOpen
                ? "translateX(-100%)"
                : "translateX(0)",
          }}
        >
          <div className="nav flex-column">
            {[
              {
                ref: profileRef,
                icon: <User size={18} />,
                label: "Profile",
                id: "profile",
              },
              {
                ref: addressRef,
                icon: <MapPin size={18} />,
                label: "Address",
                id: "address",
              },
              {
                ref: connectRef,
                icon: <LinkIcon size={18} />,
                label: "Connect",
                id: "connect",
              },
              {
                ref: productsRef,
                icon: <List size={18} />,
                label: "Categories",
                id: "categories",
              },
              {
                ref: servicesRef,
                icon: <Briefcase size={18} />,
                label: "Services",
                id: "services",
              },
            ].map((item) => (
              <button
                key={item.id}
                className={`nav-link mb-2 d-flex align-items-center ${
                  activeSection === item.id ? "active" : ""
                }`}
                onClick={() => handleScroll(item.ref, item.id)}
                style={{
                  padding: "12px 15px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor:
                    activeSection === item.id ? "#3e5012" : "transparent",
                  color: activeSection === item.id ? "white" : "#333",
                  transition: "all 0.3s ease",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <span className="me-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="col-12 col-md-9 offset-md-3">
          <div className="px-3 px-md-4">
            <div
              ref={profileRef}
              className="p-4 border rounded mb-4  "
              style={style}
            >
              <div className="row align-items-center">
                {/* Image Section with Profile Picture */}
                <div
                  className="col-md-4 text-center position-relative"
                  style={{ height: "200px" }}
                >
                  {/* Profile Picture */}
                  <div
                    className="position-absolute"
                    style={{
                      top: "-15px",
                      left: '0px',
                      width: '70px',
                      height: '70px',
                      zIndex: 2,
                      border: "1px solid green",
                      borderRadius: "50%",
                      overflow: "hidden",
                      // boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    <img
                      src={supplierData.businessLogo || "/image.png"}
                      alt="Profile"
                      className="w-100 h-100"
                      style={{ objectFit: "cover", backgroundColor: "grey" }}
                    />
                  </div>

                  {/* Main Business Image */}
                  <div
                    className="border rounded overflow-hidden"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <img
                      src={supplierData.businessImage || "/image.png"}
                      alt="Business"
                      className="img-fluid h-100 w-100"
                      style={{
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>

                {/* Details Section */}
                <div className="col-md-8">
                  <h3 className="mb-3">{supplierData.businessName}</h3>
                  <p>
                    <strong>Type:</strong> {supplierData.businessType}
                  </p>
                  <p>{supplierData.aboutUs}</p>
                  <p>
                    <a
                      href={supplierData.webSite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Visit Website
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div
              ref={addressRef}
              className="p-4 border rounded mb-4  "
              style={style}
            >
              <h3>Address</h3>
              <p>
                {supplierData.street}, {supplierData.businessHouseNo},{" "}
                {supplierData.area}
              </p>
              <p>
                {supplierData.businessCity}, {supplierData.businessCountry},{" "}
                {supplierData.businessZipCode}
              </p>
              {/* <p>
              <strong>Email:</strong> {supplierData.email}
            </p>
            <p>
              <strong>Phone:</strong> {supplierData.phoneNumber}
            </p> */}
            </div>

            <div
              ref={connectRef}
              className="p-4 border rounded mb-4  "
              style={style}
            >
              <h3>Connect</h3>
              <p>
                <strong>Website: </strong> {supplierData.webSite || "NA"}{" "}
                {supplierData.webSite && (
                  <Link to={supplierData.webSite} target="_blank">
                    <SquareArrowOutUpRight height={"15px"} />
                  </Link>
                )}
              </p>
              <p>
                <strong>Email:</strong> {supplierData.email || "NA"}
              </p>
              <p>
                <strong>Phone:</strong> {supplierData.phoneNumber || "NA"}
              </p>
              <p>
                <strong>Fax:</strong> {supplierData.faxNumber || "NA"}
              </p>
              <p>
                <strong>WhatsApp:</strong> {supplierData.whatsapp || "NA"}
              </p>
            </div>

            <div
              ref={productsRef}
              className="p-4 border rounded mb-4  "
              style={{
                ...style,
                // backgroundColor: "#fff",
                // boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3 className="mb-4">Categories</h3>
              <div className="d-flex flex-wrap gap-2">
                {supplierData.categories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 rounded-pill"
                    style={{
                      // backgroundColor: "#e9ecef",
                      color: "green",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      border: "1px solid",
                      transition: "all 0.3s ease",
                      cursor: "default",
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div
              ref={servicesRef}
              className="p-4 border rounded mb-4  "
              style={{
                ...style,
                // backgroundColor: "#fff",
                // boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h3 className="mb-4">Services</h3>
              <div className="d-flex flex-wrap gap-2">
                {supplierData.subCategories.map((subCategory, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 rounded-pill"
                    style={{
                      // backgroundColor: "#e3f2fd",
                      color: "green",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      border: "1px solid",
                      transition: "all 0.3s ease",
                      cursor: "default",
                    }}
                  >
                    {subCategory}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;

const style = {
  scrollMarginTop: "80px",
  transition: "all 0.3s ease",
  // backgroundColor:""
};
