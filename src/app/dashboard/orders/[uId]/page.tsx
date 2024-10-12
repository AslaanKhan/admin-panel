"use client";
import { DataTable } from "@/components/global/dataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAllOrders, getUserOrders, updateOrder } from "@/services/orders.services";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { ArrowUpDown } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export type Order = {
    _id: string;
    paymentMode: string;
    paymentStatus?: string;
    orderStatus?: string
    createdAt?: Date;
    amount: string;
};

type props = {
    params?: {
        uId?: string
    }
}

export default function Order({ params }:props) {
    const [data, setOrders] = useState<Order[]>([]);
    const router = useRouter();
    const { uId } = params

    const columns: ColumnDef<Order>[] = [
        {
            id: "select",
            header: ({ table }: any) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
            accessorKey: "_id",
            header: "Order Id",
            cell: ({ row }) => <div>{row.getValue("_id")}</div>,
        },
        {
            accessorKey: "paymentMode",
            header:"Payment Mode",
            cell: ({ row }) => <div className="max-w-[60%] m-auto">{row.original.paymentMode}</div>,
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Placed On
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                )
              },
            cell: ({ row }) => <div className="max-w-[80%] m-auto">{`${new Date(row.original.createdAt).toLocaleDateString().split('T')[0]}`}</div>,
        },
        {
            accessorKey: "orderStatus",
            header: "Status",
            cell: ({ row }) => <div className="capitalize">{row.getValue("orderStatus")}</div>,
        },
        {
            accessorKey: "amount",
            header: "Order amout",
            cell: ({ row }) => <div>{row.getValue("amount")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => (
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
                            Copy Order ID
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={async () => await updateOfferStatus(row.original._id, { isActive: !row.original.isActive }).then(() => fetchData())}>
                            Mark {row.original.isActive ? "Inactive" : "Active"}
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/orders/order/${row.original._id}`)}>
                            View Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem  onClick={async () =>
                                await updateOrder(row.original._id, {
                                    orderStatus: row.original?.orderStatus === 'completed' ? "pending" : "completed",
                                }).then(() => fetchData())
                            }>
                            Mark Order as { row?.original?.orderStatus === 'completed' ? "Pending" : "Completed"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const response = uId !== 'order' ? await getUserOrders(uId) : await getAllOrders()
            setOrders(response?.orders);
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    return  <>
    { uId !== 'order' && <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              Users
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              User Orders
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>}
    <DataTable<Order> columns={columns} data={data} filterField="_id" />
    </>;;
}
