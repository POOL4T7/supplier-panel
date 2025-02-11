import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import Spinner from "../../components/common/Spinner";

const forgot = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(forgot) });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.get(
        `/proxy/productsearchsupplier/user/forgotPassword?email=${data.email}`
      );
      console.log(res);
      toast.success(res.data);
      reset({ email: "" });
    } catch (e) {
      console.log(e);
    }
    // Add your logic to handle the reset password functionality
  };

  return (
    <div style={{ marginTop: "6rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "500px", width: "100%" }}>
          <h2 className="mb-4">Forgot Password</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner width="15px" height="15px" />} Send
            </button>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default ForgotPassword;
