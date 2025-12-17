import { useState } from 'react';

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title = 'Confirm',
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  return (
    <dialog className={`modal ${open ? 'modal-open' : ''}`} open={open}>
      <div className='modal-box'>
        <h3 className='font-bold text-lg'>{title}</h3>
        <div className='py-4'>{children}</div>
        <div className='modal-action'>
          <button className='btn' onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            className='btn btn-error'
            onClick={async () => {
              try {
                setLoading(true);
                await onConfirm();
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <span className='loading loading-spinner' />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
