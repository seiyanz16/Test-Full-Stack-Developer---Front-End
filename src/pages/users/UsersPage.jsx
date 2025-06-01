import { useState, useEffect, useMemo } from "react";
import axios from "@/lib/axiosInstance";
import toast from "react-hot-toast";

import DataTable from "@/components/common/DataTable";

import { Button } from "@/components/ui/button";
import FormDialog from "../../components/common/FormDialog";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [createErrors, setCreateErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "" });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userTableColumns = [
    { key: "name", header: "Nama" },
    { key: "email", header: "Email" },
  ];

  const createUserFields = useMemo(
    () => [
      {
        id: "name",
        label: "Nama",
        type: "text",
        placeholder: "Masukkan nama",
        isRequired: true,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "Masukkan email",
        isRequired: true,
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "Masukkan password",
        isRequired: true,
      },
    ],
    []
  );

  const editUserFields = useMemo(
    () => [
      {
        id: "name",
        label: "Nama",
        type: "text",
        placeholder: "Masukkan nama",
        isRequired: true,
      },
      {
        id: "email",
        label: "Email",
        type: "email",
        placeholder: "Masukkan email",
        isRequired: true,
      },
      {
        id: "password",
        label: "Password",
        type: "password",
        placeholder: "Masukkan password",
        isRequired: false,
      },
    ],
    []
  );


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/users");
        setUsers(response.data.data || response.data);
      } catch (err) {
        console.error("Gagal mengambil daftar pengguna:", err);
        setError("Gagal memuat pengguna. Silakan coba lagi nanti.");

        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          setError(
            "Sesi Anda telah berakhir atau tidak valid. Silakan login kembali."
          );
        }

        toast.error("Gagal memuat daftar pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  const handleCreateUser = async () => {
    setIsCreating(true);
    try {
      await axios.post("/users", createFormData);
      setIsCreateDialogOpen(false);
      setCreateFormData({ name: "", email: "", password: "" });
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Pengguna berhasil ditambahkan!");
    } catch (err) {
      console.error(
        "Gagal menambahkan pengguna baru:",
        err.response || err.message
      );

      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        const messages = err.response.data.data;

        let errorsToDisplay = {};
        if (validationErrors) {
          errorsToDisplay = validationErrors;
        } else if (messages && Array.isArray(messages)) {
          const generalErrors = [];
          messages.forEach((msg) => {
            if (msg.toLowerCase().includes("email"))
              errorsToDisplay.email = msg;
            else if (msg.toLowerCase().includes("password"))
              errorsToDisplay.password = msg;
            else if (msg.toLowerCase().includes("name"))
              errorsToDisplay.name = msg;
            else generalErrors.push(msg);
          });
          if (generalErrors.length > 0) {
            errorsToDisplay.general = generalErrors.join(" ");
          }
        } else if (err.response.data.message) {
          errorsToDisplay = { general: err.response.data.message };
        }
        setCreateErrors(errorsToDisplay);
        toast.error("Gagal membuat pengguna. Periksa kembali form Anda.");
      } else {
        toast.error("Gagal menambahkan pengguna baru. Silakan coba lagi.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  // edit

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setEditFormData({ name: user.name, email: user.email });
    setEditErrors({});
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { id, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [id]: value }));
    setEditErrors((prev) => ({ ...prev, [id]: undefined, general: undefined }));
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      await axios.put(`/users/${selectedUser.id}`, editFormData);
      setIsEditDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Pengguna berhasil diperbarui!");
    } catch (err) {
      console.error("Gagal memperbarui pengguna:", err.response || err.message);
      if (err.response && err.response.status === 422) {
        const validationErrors = err.response.data.errors;
        const messages = err.response.data.data;

        let errorsToDisplay = {};
        if (validationErrors) {
          errorsToDisplay = validationErrors;
        } else if (messages && Array.isArray(messages)) {
          errorsToDisplay = { general: messages.join(" ") };
        } else if (err.response.data.message) {
          errorsToDisplay = { general: err.response.data.message };
        }
        setEditErrors(errorsToDisplay);
        toast.error("Gagal memperbarui pengguna. Periksa kembali form Anda.");
      } else {
        toast.error("Gagal memperbarui pengguna. Silakan coba lagi.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // delete

  const handleDeleteClick = (userId) => {
    setUserToDeleteId(userId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDeleteId) return;

    setIsDeleting(true);
    try {
      await axios.delete(`/users/${userToDeleteId}`);
      setIsDeleteDialogOpen(false);
      setUserToDeleteId(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Pengguna berhasil dihapus!");
    } catch (err) {
      console.error("Gagal menghapus pengguna:", err.response || err.message);
      toast.error("Gagal menghapus pengguna. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Users List</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Add</Button>
      </div>
      
      <DataTable
        data={users}
        columns={userTableColumns}
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
        title="Create New User"
        fields={createUserFields}
        formData={createFormData}
        onFormChange={handleCreateFormChange}
        onSubmit={handleCreateUser}
        isSubmitting={isCreating}
        errors={createErrors}
        submitButtonText="Submit"
      />

      {/* --- Edit Dialog --- */}
      <FormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title="Edit User"
        fields={editUserFields}
        formData={editFormData}
        onFormChange={handleEditFormChange}
        onSubmit={handleUpdateUser}
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

export default UsersPage;
