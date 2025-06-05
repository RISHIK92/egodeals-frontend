"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  GripVertical,
  Briefcase, // Import default fallback icon
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableItem } from "@/components/ui/sortableItem";
import IconSelector from "@/components/ui/iconSelector";
import * as LucideIcons from "lucide-react";

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-gray-500",
];

// Helper function to safely render icons
const renderIcon = (iconName, className = "h-5 w-5") => {
  if (!iconName) return <Briefcase className={className} />;

  const IconComponent = LucideIcons[iconName];
  if (!IconComponent) {
    return <Briefcase className={className} />;
  }

  return <IconComponent className={className} />;
};

const HomeCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    categoryId: "",
    iconName: "Briefcase",
    color: "blue",
  });
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [iconSelectorFor, setIconSelectorFor] = useState(null);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [homeCategoriesRes, allCategoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-categories`),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-categories/all-categories`
          ),
        ]);

        if (!homeCategoriesRes.ok || !allCategoriesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const homeCategories = await homeCategoriesRes.json();
        const allCategories = await allCategoriesRes.json();

        setCategories(homeCategories);
        setAvailableCategories(
          allCategories.filter(
            (cat) => !homeCategories.some((hc) => hc.categoryId === cat.id)
          )
        );
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-categories`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            homeCategories: categories.map((cat) => ({
              id: cat.id,
              name: cat.name,
              categoryId: cat.categoryId,
              iconName: cat.iconName,
              color: cat.color,
            })),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save home categories");
      }

      toast.success("Home categories updated successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update home categories");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.categoryId || !newCategory.name) {
      toast.error("Please select a category and enter a name");
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: newCategory.name,
            categoryId: newCategory.categoryId,
            iconName: newCategory.iconName,
            color: newCategory.color,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const addedCategory = await response.json();

      // Update local state
      setCategories([...categories, addedCategory]);
      setAvailableCategories(
        availableCategories.filter((cat) => cat.id !== newCategory.categoryId)
      );
      setIsAdding(false);
      setNewCategory({
        name: "",
        categoryId: "",
        iconName: "Briefcase",
        color: "blue",
      });

      toast.success("Category added successfully");
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Failed to add category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      setIsDeleting(true);
      setDeleteId(id);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_ADMIN}/home-categories/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      // Update local state
      const deletedCategory = categories.find((cat) => cat.id === id);
      setCategories(categories.filter((cat) => cat.id !== id));

      if (deletedCategory.categoryId) {
        const categoryToRestore = availableCategories.find(
          (cat) => cat.id === deletedCategory.categoryId
        ) || { id: deletedCategory.categoryId, name: deletedCategory.name };
        setAvailableCategories([...availableCategories, categoryToRestore]);
      }

      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete category");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const updateCategoryProperty = (id, property, value) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, [property]: value } : cat
      )
    );
  };

  const handleCategorySelect = (categoryId) => {
    const selectedCategory = availableCategories.find(
      (cat) => cat.id === categoryId
    );
    setNewCategory((prev) => ({
      ...prev,
      categoryId,
      name: selectedCategory?.name || "",
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Home Categories</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Category
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isSaving ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Add Category to Homepage
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-gray-700"
              >
                Category *
              </label>
              <select
                id="category-select"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newCategory.categoryId}
                onChange={(e) => handleCategorySelect(e.target.value)}
              >
                <option value="">Select a category</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name *
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="Display name for homepage"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Icon
              </label>
              <div className="mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIconSelectorFor("new");
                    setShowIconSelector(true);
                  }}
                  className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {renderIcon(newCategory.iconName)}
                  <span>{newCategory.iconName || "Select Icon"}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "blue",
                  "green",
                  "red",
                  "yellow",
                  "purple",
                  "pink",
                  "indigo",
                  "gray",
                ].map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${`bg-${color}-500`} ${
                      newCategory.color === color
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAdding(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="w-5 h-5 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.categoryId || !newCategory.name}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  !newCategory.categoryId || !newCategory.name
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <Check className="w-5 h-5 mr-1" />
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Homepage Categories
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Drag and drop to reorder categories.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-gray-500">No categories added yet</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={categories}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <SortableItem key={category.id} id={category.id}>
                    <li className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${`bg-${category.color}-500`} text-white`}
                          >
                            {renderIcon(category.iconName)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {category.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {category._count?.listings || 0} listings
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              value={category.name}
                              onChange={(e) =>
                                updateCategoryProperty(
                                  category.id,
                                  "name",
                                  e.target.value
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={() => {
                                setIconSelectorFor(category.id);
                                setShowIconSelector(true);
                              }}
                              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                              {renderIcon(category.iconName)}
                              <span className="truncate max-w-xs">
                                {category.iconName || "Select"}
                              </span>
                            </button>

                            <select
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              value={category.color}
                              onChange={(e) =>
                                updateCategoryProperty(
                                  category.id,
                                  "color",
                                  e.target.value
                                )
                              }
                            >
                              <option value="blue">Blue</option>
                              <option value="green">Green</option>
                              <option value="red">Red</option>
                              <option value="yellow">Yellow</option>
                              <option value="purple">Purple</option>
                              <option value="pink">Pink</option>
                              <option value="indigo">Indigo</option>
                              <option value="gray">Gray</option>
                            </select>
                          </div>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={isDeleting && deleteId === category.id}
                            className="text-red-600 hover:text-red-900 disabled:text-red-300"
                          >
                            {isDeleting && deleteId === category.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </li>
                  </SortableItem>
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {showIconSelector && (
        <IconSelector
          value={
            iconSelectorFor === "new"
              ? newCategory.iconName
              : categories.find((c) => c.id === iconSelectorFor)?.iconName
          }
          onChange={(iconName) => {
            if (iconSelectorFor === "new") {
              setNewCategory({ ...newCategory, iconName });
            } else {
              updateCategoryProperty(iconSelectorFor, "iconName", iconName);
            }
          }}
          onClose={() => setShowIconSelector(false)}
        />
      )}

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

export default HomeCategoriesPage;
