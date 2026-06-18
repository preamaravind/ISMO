import { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const showSuccess = (msg) => toast.success(msg);
  const showError = (msg) => toast.error(msg);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <Toaster position="top-right" />
    </ToastContext.Provider>
  );
};
