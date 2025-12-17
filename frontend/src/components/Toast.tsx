type ToastProps = {
  open: boolean;
  children?: React.ReactNode;
};

export function Toast({ open, children }: ToastProps) {
  if (!open) return null;
  return (
    <dialog className='modal modal-open' open>
      <div className='modal-box'>{children}</div>
    </dialog>
  );
}
