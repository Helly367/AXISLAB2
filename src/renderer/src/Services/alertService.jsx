import { toast } from "react-toastify";

/* ============================= */
/* CONFIGURATION GLOBALE        */
/* ============================= */

const baseConfig = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored"
};

/* ============================= */
/* FONCTION GENERIQUE           */
/* ============================= */

const notify = (type = "default", message = "", options = {}) => {
  const config = { ...baseConfig, ...options };

  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "warning":
      toast.warning(message, config);
      break;
    case "info":
      toast.info(message, config);
      break;
    default:
      toast(message, config);
  }
};

/* ============================= */
/* GESTION ERREURS BACKEND      */
/* ============================= */

const handleBackendResponse = (response, options = {}) => {
  if (!response) {
    notify("error", "Aucune réponse du serveur", options);
    return false;
  }

  if (response.success) {
    return true;
  }

  // 🔥 IMPORTANT : gérer errors OU error
  const errors = response.errors || response.error;

  if (Array.isArray(errors)) {
    errors.forEach(e =>
      notify("error", e.message || "Erreur", options)
    );
  } else if (typeof errors === "string") {
    notify("error", errors, options);
  } else if (errors?.message) {
    notify("error", errors.message, options);
  } else {
    notify("error", "Erreur inconnue", options);
  }

  return false;
};

/* ============================= */
/* EXPORT GLOBAL                */
/* ============================= */

export const alertService = {
  success: (msg, opt) => notify("success", msg, opt),
  error: (msg, opt) => notify("error", msg, opt),
  warning: (msg, opt) => notify("warning", msg, opt),
  info: (msg, opt) => notify("info", msg, opt),
  default: (msg, opt) => notify("default", msg, opt),
  handleBackendResponse
};