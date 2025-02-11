import PropTypes from "prop-types";

const Spinner = ({ width = "100px", height = "100px" }) => {
  return (
    <span className="container text-center mt-3">
      <span
        className="spinner-border"
        role="status"
        style={{ width: width, height: height }}
      >
        <span className="visually-hidden">Loading...</span>
      </span>
    </span>
  );
};

Spinner.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Spinner;
