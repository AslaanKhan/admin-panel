"use client";
import { DataTable } from "@/components/global/dataTable";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { getAllProducts } from "@/services/porducts.services";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type User = {
  _id: string;
  name?: string;
  email?: string;
  address?: string;
  number: string;
  isAdmin: boolean;
};

export default function User() {
  const [data, setUsers] = React.useState<User[]>([]);
  const router = useRouter()

  const columns: ColumnDef<User>[] = [
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
              {isExpanded ? "Show less" : "Show more"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("category")}</div>
      ),
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText("")}>
                Copy product ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/products/${row.original._id}`);
                }}
              >
                View or Edit product
              </DropdownMenuItem>
              <DropdownMenuItem>View user orders</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProducts();
        setUsers(response?.data?.products);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);  

  return <DataTable<User> columns={columns} data={data} filterField="title" />;
}

