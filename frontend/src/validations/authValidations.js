import * as Yup from "yup";

/** Login Validation */
const loginValidation = Yup.object({
  email: Yup.string().email().required("Please provide email address"),
  password: Yup.string()
    .min(7, "Password must be at least 8 characters")
    .required(),
});

export default loginValidation;
