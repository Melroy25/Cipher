import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal.tsx";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  isDestructive = true,
  isLoading = false,
}) => {
  const handleClose = onClose || onCancel || (() => {});
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
            isDestructive ? "bg-red-500/10 text-red-400 border border-red-500/30" : "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30"
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>

        <p className="font-mono text-sm text-[#a0c0a8] mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 w-full border-t border-[#00ff66]/15 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg font-mono text-xs tracking-wider border border-[#00ff66]/30 text-[#88aa90] hover:text-white hover:border-[#00ff66] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-lg font-mono text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
              isDestructive
                ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                : "bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] shadow-[0_0_15px_rgba(0,255,102,0.4)]"
            }`}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};