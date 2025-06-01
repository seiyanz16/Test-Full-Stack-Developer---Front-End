import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Reusable komponen confirm dialog.
 *
 * @param {Object} props - Properti untuk komponen ConfirmDialog.
 * @param {boolean} props.isOpen - Mengontrol visibilitas dialog.
 * @param {function(boolean): void} props.onOpenChange - Function callback saat status buka/tutup dialog berubah.
 * @param {string} props.title - Judul konfirmasi (example: "Are you sure?").
 * @param {string} props.description - Deskripsi detail konfirmasi.
 * @param {function(): void} props.onConfirm - Function callback saat konfirmasi dilakukan.
 * @param {boolean} props.isConfirming - Status indikator loading saat konfirmasi sedang diproses.
 * @param {string} props.confirmButtonText - Teks untuk tombol konfirmasi (default "Konfirmasi").
 * @param {string} [props.cancelButtonText='Batal'] - Teks untuk tombol batal.
 */
const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  isConfirming,
  confirmButtonText,
  cancelButtonText = "Batal",
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>
            {cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? "Memproses..." : confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
