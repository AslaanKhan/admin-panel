"use client";
import { DataTable } from "@/components/global/dataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createCategory,
  deleteCategoryById,
  getCategories,
  updateCategoryById,
} from "@/services/category.service";
import { getProductByCategory } from "@/services/porducts.services";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export type Category = {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: [
    {
      path: string;
      _id: string;
    }
  ];
  category: {
    name: string;
    id: string;
  };
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export default function Categories() {
  const [data, setCategories] = React.useState<Category[]>([]);
  const totalProducts = async (categoryId:string) => await getProductByCategory(categoryId);

  const columns: ColumnDef<Category>[] = [
    {
      id: "select",
      header: ({ table }: any) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Title",
      cell: ({ row }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        return (
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`line-clamp-1 cursor-pointer ${
              isExpanded ? "line-clamp-none" : ""
            }`}
          >
            {row.getValue("name")}
          </div>
        );
      },
    },
    {
      accessorKey: "isAvailable",
      header: "Available",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("isAvailable") ? "yes" : "no"}
        </div>
      ),
    },
    {
      header: "Total Products",
      cell: ({ row }) => {
        const [total, setTotal] = useState(0);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
          const fetchTotalProducts = async () => {
            setLoading(true);
            try {
              const totalCount = await totalProducts(row.original._id);
              setTotal(totalCount?.product?.length);
            } catch (error) {
              console.error("Error fetching total products:", error);
            } finally {
              setLoading(false);
            }
          };

          fetchTotalProducts();
        }, [row.original._id]);

        return (
          <div className="capitalize">
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>{total}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.original._id)}
              >
                Copy category Id
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => await updateCategory(row.original._id)}
              >
                Edit Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () =>
                  await updateCategoryById(row.original._id, {
                    isAvailable: !row.original?.isAvailable,
                  }).then(() => fetchData())
                }
              >
                Mark {row.original.isAvailable ? `out of` : "in"} stock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchData = async () => {
    try {
      const response = await getCategories();
      setCategories(response?.categories);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const updateCategory = async (categoryId: string) => {
    const { value } = await Swal.fire({
      title: "Update Category Name",
      input: "text",
      inputLabel: "Category Name",
      inputPlaceholder: "Type your category name here...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      icon: "info",
    });
    try {
      await updateCategoryById(categoryId, { name: value });
      fetchData();
    } catch (error) {}
  };

  const createNewCategory = async () => {
    const { value } = await Swal.fire({
      title: "Enter Category Name",
      input: "text",
      inputLabel: "Category Name",
      inputPlaceholder: "Type your category name here...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      icon: "info",
    });
    try {
      await createCategory({ name: value });
      fetchData();
    } catch (error) {}
  };

  const deleteCategory = async (selectedRow: any) => {
    await Swal.fire({
      title: "Are you sure? This action cannot be undone.",
      text: "Once deleted, you will not be able to recover this category",
      inputLabel: "Delete Category",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      icon: "error",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCategoryById(selectedRow?._id);
        fetchData();
      }
    });
  };

  return (
    <DataTable<Category>
      columns={columns}
      data={data}
      filterField="name"
      onCreateRecord={createNewCategory}
      deleteRow={deleteCategory}
    />
  );
}
