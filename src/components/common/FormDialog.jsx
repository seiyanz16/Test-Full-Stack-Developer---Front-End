import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Reusable komponen dialog form untuk membuat atau mengedit entitas.
 *
 * @param {Object} props - Properti untuk komponen FormDialog.
 * @param {boolean} props.isOpen - Mengontrol visibilitas dialog.
 * @param {function(boolean): void} props.onOpenChange - Function callback saat status buka/tutup dialog berubah.
 * @param {string} props.title - Judul dialog (example: "Add New Product", "Edit Product").
 * @param {string} props.description - Deskripsi dialog.
 * @param {Array<Object>} props.fields - Array definisi field form. Setiap objek field:
 * - {string} id: ID unik untuk input, juga kunci dalam formData.
 * - {string} label: Label yang ditampilkan.
 * - {string} type: Tipe input HTML (text, email, password, number, dll.).
 * - {string} [placeholder]: Placeholder untuk input.
 * - {boolean} [isRequired]: Menandakan apakah field wajib diisi.
 * @param {Object} props.formData - Objek yang berisi data form saat ini (key-value pair).
 * @param {function(Event): void} props.onFormChange - Function callback saat input form berubah.
 * @param {function(): void} props.onSubmit - Function callback saat form disubmit.
 * @param {boolean} props.isSubmitting - Status indikator loading saat submit.
 * @param {Object} props.errors - Objek berisi error validasi (key-value pair, di mana key adalah id field).
 * @param {string} props.submitButtonText - Teks untuk tombol submit (example: "Save", "Submit").
 */
const FormDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  fields,
  formData,
  onFormChange,
  onSubmit,
  isSubmitting,
  errors,
  submitButtonText,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {errors.general && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
                {field.isRequired && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.id] || ""}
                onChange={onFormChange}
                readOnly={field.readOnly}
                className={
                  errors[field.id] ? "col-span-3 border-red-500" : "col-span-3"
                }
              />
              {errors[field.id] && (
                <p className="col-span-4 text-right text-sm text-red-500">
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : submitButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
