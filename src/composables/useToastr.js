import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const notify = (message, type, ms = 3000) => {
  const options = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: ms,
    clearOnUrlChange: false,
  };

  if (type === 'error') {
    toast.error(message, options); // ToastOptions
  } else if (type === 'success') {
    toast.success(message, options); // ToastOptions
  } else {
    toast.info(message, options); // ToastOptions
  }
}

