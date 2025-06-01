import { useState, useEffect, useMemo } from "react";
import axios from "@/lib/axiosInstance";
import toast from "react-hot-toast";

import DataTable from "@/components/common/DataTable";

import { Button } from "@/components/ui/button";
import FormDialog from "../../components/common/FormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    date: "",
    amount: 0,
    discount: 0,
    note: "",
  });
  const [createErrors, setCreateErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    amount: 0,
    discount: 0,
    note: "",
  });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const transactionTableColumns = useMemo(
    () => [
      {
        key: "date",
        header: "Date",
        render: (item) => new Date(item.date).toLocaleDateString("id-ID"),
      },
      {
        key: "amount",
        header: "Amount (Rp)",
        render: (item) =>
          `Rp${parseFloat(item.amount).toLocaleString("id-ID")}`,
      },
      {
        key: "discount",
        header: "Discount (%)",
        render: (item) => `${Math.floor(parseFloat(item.discount))}%`,
      },
      {
        key: "total",
        header: "Total (Rp)",
        render: (item) => `Rp${parseFloat(item.total).toLocaleString("id-ID")}`,
      },
      { key: "note", header: "Note" },
    ],
    []
  );

  const createTransactionFields = useMemo(
    () => [
      {
        id: "date",
        label: "Date",
        type: "date",
        placeholder: "Pilih tanggal",
        isRequired: true,
      },
      {
        id: "amount",
        label: "Amount (Rp)",
        type: "number",
        placeholder: "Masukkan jumlah (Rp)",
        isRequired: true,
      },
      {
        id: "discount",
        label: "Discount (%)",
        type: "number",
        placeholder: "Masukkan persentase diskon (0-100)",
        isRequired: true,
      },
      {
        id: "note",
        label: "Note",
        type: "text",
        placeholder: "Masukkan catatan transaksi",
        isRequired: false,
      },
    ],
    []
  );

  const editTransactionFields = useMemo(
    () => [
      {
        id: "date",
        label: "Date",
        type: "date",
        placeholder: "Pilih tanggal",
        isRequired: true,
      },
      {
        id: "amount",
        label: "Amount (Rp)",
        type: "number",
        placeholder: "Masukkan jumlah (Rp)",
        isRequired: true,
      },
      {
        id: "discount",
        label: "Discount (%)",
        type: "number",
        placeholder: "Masukkan persentase diskon (0-100)",
        
        isRequired: true,
      },
      {
        id: "total",
        label: "Total (Rp)",
        type: "number",
        readOnly: true,
        render: (value) => `Rp${parseFloat(value).toLocaleString("id-ID")}`,
      },
      {
        id: "note",
        label: "Note",
        type: "text",
        placeholder: "Masukkan catatan transaksi",
        isRequired: false,
      },
    ],
    []
  );

  useEffect(() => {
    const fetchtransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/transactions");
        setTransactions(response.data.data || response.data);
      } catch (err) {
        console.error("Gagal mengambil daftar transaksi:", err);
        setError("Gagal memuat transaksi. Silakan coba lagi nanti.");

        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          setError(
            "Sesi Anda telah berakhir atau tidak valid. Silakan login kembali."
          );
        }

        toast.error("Gagal memuat daftar transaksi.");
      } finally {
        setLoading(false);
      }
    };

    fetchtransactions();
  }, [refreshTrigger]);

  // create
  const handleCreateFormChange = (e) => {
    const { id, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [id]: value }));
    setCreateErrors((prev) => ({
      ...prev,
      [id]: undefined,
      general: undefined,
    }));
  };

  const handleCreateTransaction = async () => {
    setIsCreating(true);
    setCreateErrors({});
    try {
      const amount = parseFloat(createFormData.amount);
      const discount = parseFloat(createFormData.discount);

      if (isNaN(amount) || amount < 0) {
        setCreateErrors((prev) => ({
          ...prev,
          amount: "Jumlah harus angka positif.",
        }));
        return;
      }
      if (isNaN(discount) || discount < 0 || discount > 100) {
        setCreateErrors((prev) => ({
          ...prev,
          discount: "Diskon harus antara 0 dan 100.",
        }));
        return;
      }

      await axios.post("/transactions", {
        ...createFormData,
        amount: amount,
        discount: discount,
      });
      setIsCreateDialogOpen(false);
      setCreateFormData({ date: "", amount: "", discount: "", note: "" });
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Transaksi berhasil ditambahkan!");
    } catch (err) {
      console.error(
        "Gagal menambahkan transaksi baru:",
        err.response || err.message
      );

      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        let errorsToDisplay = {};
        if (validationErrors) {
          Object.keys(validationErrors).forEach((key) => {
            errorsToDisplay[key] = validationErrors[key][0];
          });
        } else if (err.response.data.message) {
          errorsToDisplay = { general: err.response.data.message };
        }
        setCreateErrors(errorsToDisplay);
        toast.error("Gagal membuat transaksi. Periksa kembali form Anda.");
      } else {
        toast.error("Gagal menambahkan transaksi baru. Silakan coba lagi.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  // edit

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setEditFormData({
      date: transaction.date,
      amount: transaction.amount,
      discount: transaction.discount,
      total: transaction.total,
      note: transaction.note,
    });
    setEditErrors({});
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { id, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [id]: value }));
    setEditErrors((prev) => ({ ...prev, [id]: undefined, general: undefined }));
  };

  const handleUpdateTransaction = async () => {
    if (!selectedTransaction) return;

    setIsSaving(true);
    setEditErrors({});
    try {
      const amount = parseFloat(editFormData.amount);
      const discount = parseFloat(editFormData.discount);

      if (isNaN(amount) || amount < 0) {
        setEditErrors((prev) => ({
          ...prev,
          amount: "Jumlah harus angka positif.",
        }));
        return;
      }
      if (isNaN(discount) || discount < 0 || discount > 100) {
        setEditErrors((prev) => ({
          ...prev,
          discount: "Diskon harus antara 0 dan 100.",
        }));
        return;
      }

      await axios.put(`/transactions/${selectedTransaction.id}`, {
        ...editFormData,
        amount: amount,
        discount: discount,
      });
      setIsEditDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Transaksi berhasil diperbarui!");
    } catch (err) {
      console.error(
        "Gagal memperbarui transaksi:",
        err.response || err.message
      );
      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        let errorsToDisplay = {};
        if (validationErrors) {
          Object.keys(validationErrors).forEach((key) => {
            errorsToDisplay[key] = validationErrors[key][0];
          });
        } else if (err.response.data.message) {
          errorsToDisplay = { general: err.response.data.message };
        }
        setEditErrors(errorsToDisplay);
        toast.error("Gagal memperbarui transaksi. Periksa kembali form Anda.");
      } else {
        toast.error("Gagal memperbarui transaksi. Silakan coba lagi.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // delete

  const handleDeleteClick = (transactionId) => {
    setTransactionToDeleteId(transactionId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDeleteId) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/transactions/${transactionToDeleteId}`);
      setIsDeleteDialogOpen(false);
      setTransactionToDeleteId(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Transaksi berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus transaksi:", err.response || err.message);
      toast.error("Gagal menghapus transaksi. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Transactions List
        </h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Add</Button>
      </div>

      <DataTable
        data={transactions}
        columns={transactionTableColumns}
        loading={loading}
        error={error}
        onRowClick={handleRowClick}
        onDeleteClick={handleDeleteClick}
        idKey="id"
      />

      {/* --- Create Dialog --- */}
      <FormDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        title="Create New Transaction"
        fields={createTransactionFields}
        formData={createFormData}
        onFormChange={handleCreateFormChange}
        onSubmit={handleCreateTransaction}
        isSubmitting={isCreating}
        errors={createErrors}
        submitButtonText="Submit"
      />

      {/* --- Edit Dialog --- */}
      <FormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit Transaction"
        fields={editTransactionFields}
        formData={editFormData}
        onFormChange={handleEditFormChange}
        onSubmit={handleUpdateTransaction}
        isSubmitting={isSaving}
        errors={editErrors}
        submitButtonText="Submit"
      />

      {/* --- Delete Dialog --- */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Are you sure?"
        description="This action cannot be undone."
        onConfirm={handleConfirmDelete}
        isConfirming={isDeleting}
        confirmButtonText="Delete"
      />
    </div>
  );
};

export default TransactionsPage;
