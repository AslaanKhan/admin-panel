"use client";
import { DataTable } from "@/components/global/dataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { deleteProductById, getAllProducts, updateStock } from "@/services/porducts.services";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

export type Product = {
    _id: string,
    title: string,
    price: number,
    description: string,
    image: [
        {
            path: string
            "_id": string
        }
    ],
    category: {
      name: string
      id: string
    },
    isAvailable: boolean,
    createdAt: Date,
    updatedAt: Date,
    __v: number
}

export default function Product() {
  const [data, setProducts] = React.useState<Product[]>([]);
  const router = useRouter()

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }:any) => (
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
      accessorKey: "title",
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
            {row.getValue("title")}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <div className="capitalize">Rs.{row.getValue("price")}</div>,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const [isExpanded, setIsExpanded] = useState(false);
  
        return (
          <div className="flex items-center">
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className={`line-clamp-1 cursor-pointer ${
                isExpanded ? "line-clamp-none" : ""
              }`}
            >
              {row.getValue("description")}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.category?.name}</div>
      ),
    },
    {
      accessorKey: "isAvailable",
      header: "In stock",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("isAvailable") ? "yes" : "no"}
        </div>
      ),
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(row.original._id)}>
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async() => await updateStock(row.original._id, {isAvailable: !row.original?.isAvailable}).then(() => fetchData())}>
                Mark {row.original.isAvailable ? `out of` : 'in'} stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/products/${row.original._id}`);
                }}
              >
                View or Edit product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const fetchData = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response?.data?.products);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {    
    fetchData();
  }, []);  

  const createNewProduct = () => {
    router.push("/dashboard/products/new");
  }

  const deleteProduct = async (selectedRow:any) => {
    await Swal.fire({
      title: "Are you sure? This action cannot be undone.",
      text: "Once deleted, you will not be able to recover this product",
      inputLabel: "Delete Product",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      icon: "error",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProductById(selectedRow?._id);
        fetchData();
      }
    })
  }

  return <DataTable<Product> columns={columns} data={data} filterField="title" onCreateRecord={createNewProduct} deleteRow={deleteProduct} />;
}

