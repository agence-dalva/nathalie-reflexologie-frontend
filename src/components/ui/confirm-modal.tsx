"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  loading = false,
  destructive = true,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-stone-600">{description}</p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            withArrow={false}
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? "secondary" : "primary"}
            withArrow={false}
            onClick={onConfirm}
            disabled={loading}
            className={
              destructive
                ? "flex-1 border-red-300! bg-red-50! text-red-600! hover:border-red-400! hover:bg-red-100!"
                : "flex-1"
            }
          >
            {loading ? "…" : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
