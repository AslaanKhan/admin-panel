"use client";
import { DataTable } from "@/components/global/dataTable";
import { getAllUsers } from "@/services/user.services";
import { useRouter } from "next/navigation";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

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
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && true)}
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
      header: "Name",
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "number",
      header: "Number",
      cell: ({ row }) => <div className="capitalize">{row.getValue("number")}</div>,
    },
    {
      accessorKey: "isAdmin",
      header: "Admin",
      cell: ({ row }) => <div className="capitalize">{row.getValue("isAdmin") ? "yes" : "no"}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }: any) => {
        const payment = row.original;

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
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/dashboard/users/${row.original._id}`);
                }}
              >
                View or Edit user
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
        const response = await getAllUsers();
        setUsers(response?.data?.users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);  

  return <DataTable<User> columns={columns} data={data} />;
}
