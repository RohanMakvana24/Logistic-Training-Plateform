import * as Yup from "yup";
export const newUserValidation = Yup.object({
  full_name: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),

  role: Yup.string()
    .oneOf(["admin", "user"], "Role must be either admin or user")
    .required("Role is required"),

  is_active: Yup.string().required("Status is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Please provide email address"),

  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),

  profile: Yup.mixed()
    .required("Profile image is required")
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return false;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    })
    .test("fileSize", "File size is too large (max 2MB)", (value) => {
      if (!value) return false;
      return value.size <= 2 * 1024 * 1024;
    }),
});
