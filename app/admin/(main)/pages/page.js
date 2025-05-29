"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { Toolbar } from "primereact/toolbar";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Plus, Trash, Edit, Check, X, Loader2 } from "lucide-react";

const PageManagement = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState({
    id: "",
    title: "",
    slug: "",
    content: "",
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/pages`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pages");
      }

      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Pages fetch error:", error);
      toast.error("Failed to load pages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentPage({
      id: "",
      title: "",
      slug: "",
      content: "",
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (page) => {
    setCurrentPage(page);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (page) => {
    confirmDialog({
      message: `Are you sure you want to delete the "${page.title}" page?`,
      header: "Confirm Deletion",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => deletePage(page.id),
    });
  };

  const deletePage = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/pages/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete page");
      }

      toast.success("Page deleted successfully");
      fetchPages();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete page");
    }
  };

  const savePage = async () => {
    if (!currentPage?.title || !currentPage?.slug || !currentPage?.content) {
      toast.warn("Please fill all required fields");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(currentPage.slug)) {
      toast.warn(
        "Slug can only contain lowercase letters, numbers, and hyphens"
      );
      return;
    }

    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/pages/${currentPage.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/admin/pages`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: currentPage.title,
          slug: currentPage.slug,
          content: currentPage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditing ? "Failed to update page" : "Failed to create page"
        );
      }

      toast.success(
        isEditing ? "Page updated successfully" : "Page created successfully"
      );
      setIsDialogOpen(false);
      fetchPages();
    } catch (error) {
      console.error("Save error:", error);
      toast.error(
        isEditing ? "Failed to update page" : "Failed to create page"
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Page Management</h1>
          <p className="text-gray-500">Create and manage your website pages</p>
        </div>
        <button
          type="submit"
          onClick={handleCreate}
          className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Create New Page
        </button>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex space-x-2">
        <Button
          icon={<Edit className="w-5 h-5 m-3" />}
          className="p-button-rounded p-button-text text-blue-600 hover:bg-blue-50 border-none"
          onClick={() => handleEdit(rowData)}
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon={<Trash className="w-5 h-5" />}
          className="p-button-rounded p-button-text text-red-600 hover:bg-red-50 border-none"
          onClick={() => handleDelete(rowData)}
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Toolbar
          className="px-6 py-4 border-b border-gray-100"
          left={leftToolbarTemplate}
        />

        <div className="p-6">
          <DataTable
            value={pages}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} pages"
            globalFilter={globalFilter}
            emptyMessage="No pages found."
            loading={isLoading}
            className="p-datatable-xl border border-gray-100 rounded-lg p-2 my-6"
            rowClassName={() => "hover:bg-gray-50"}
          >
            <Column
              field="title"
              header="Title"
              sortable
              style={{ minWidth: "200px" }}
              headerClassName="text-gray-700 font-semibold"
            />
            <Column
              field="slug"
              header="Slug"
              sortable
              style={{ minWidth: "150px" }}
              headerClassName="text-gray-700 font-semibold"
            />
            <Column
              field="updatedAt"
              header="Last Updated"
              sortable
              body={(rowData) => formatDate(rowData.updatedAt)}
              style={{ minWidth: "150px" }}
              headerClassName="text-gray-700 font-semibold"
            />
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "100px" }}
              headerClassName="text-gray-700 font-semibold"
            />
          </DataTable>
        </div>
      </div>

      <Dialog
        visible={isDialogOpen}
        style={{ width: "80vw", maxWidth: "800px" }}
        header={isEditing ? "Edit Page" : "Create New Page"}
        modal
        className="bg-white rounded-xl shadow-lg border border-gray-100"
        onHide={() => setIsDialogOpen(false)}
        headerClassName="border-b border-gray-100 px-6 py-4"
      >
        <div className="space-y-5 px-6 py-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <InputText
              id="title"
              value={currentPage?.title || ""}
              onChange={(e) =>
                setCurrentPage({ ...currentPage, title: e.target.value })
              }
              required
              autoFocus
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter page title"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-2">
                (URL-friendly identifier)
              </span>
            </label>
            <InputText
              id="slug"
              value={currentPage?.slug || ""}
              onChange={(e) =>
                setCurrentPage({
                  ...currentPage,
                  slug: e.target.value.toLowerCase(),
                })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., about-us"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <Editor
              id="content"
              value={currentPage?.content || ""}
              onTextChange={(e) =>
                setCurrentPage({ ...currentPage, content: e.htmlValue || "" })
              }
              style={{ height: "320px" }}
              className="border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <Button
            label="Cancel"
            icon={<X className="w-4 h-4 mr-2" />}
            className="text-gray-600 hover:bg-gray-50 border border-gray-300 p-2 rounded-md"
            onClick={() => setIsDialogOpen(false)}
          />
          <Button
            label={isEditing ? "Update Page" : "Create Page"}
            icon={<Check className="w-4 h-4 mr-2" />}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm p-2 rounded-md"
            onClick={savePage}
          />
        </div>
      </Dialog>

      <ConfirmDialog />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default PageManagement;
