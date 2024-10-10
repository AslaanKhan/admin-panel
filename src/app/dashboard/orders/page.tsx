"use client";
import { DataTable } from "@/components/global/dataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAllOrders } from "@/services/orders.services";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { ArrowUpDown } from "lucide-react"

export type Order = {
    _id: string;
    paymentMode: string;
    paymentStatus?: string;
    orderStatus?: string
    createdAt?: Date;
    amount: string;
};

export default function Order() {
    const [data, setOrders] = useState<Order[]>([]);
    const router = useRouter();

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
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/offers/${row.original._id}`)}>
                            View Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteOffer(row.original)}>
                            Change Order Status
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response?.order);
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const deleteOffer = async (selectedRow: Order) => {
        await Swal.fire({
            title: "Are you sure? This action cannot be undone.",
            text: "Once deleted, you will not be able to recover this offer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                // await deleteOfferById(selectedRow._id);
                // fetchData();
            }
        });
    };

    return <DataTable<Order> columns={columns} data={data} filterField="_id" />;
}
