// ToastContainer.jsx
import React from 'react';
import { CToaster, CToast, CToastHeader, CToastBody } from "@coreui/react";

export const ToastContainer = ({ toasts, dispatch }) => (
  <CToaster placement="top-end">
    {toasts.map((t) => (
      <CToast 
        key={t.id} 
        visible 
        color={t.type} 
        className="text-white"
        autohide={true}
      >
        <CToastHeader closeButton className="text-white">
          <strong className="me-auto">
            {t.type === "success" ? "✅ Éxito" : 
             t.type === "warning" ? "⚠ Advertencia" : 
             "ℹ Información"}
          </strong>
        </CToastHeader>
        <CToastBody>{t.message}</CToastBody>
      </CToast>
    ))}
  </CToaster>
);