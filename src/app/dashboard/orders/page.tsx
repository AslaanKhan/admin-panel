"use client";
import { DataTable } from "@/components/global/dataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

export type Offer = {
    _id: string;
    productIds: string[];
    discountPercentage?: number;
    conditions?: {
        minQuantity?: number;
        discountPerKg?: number;
    };
    startDate: Date;
    endDate: Date;
    isActive: boolean;
};

export default function Offers() {
    const [data, setOffers] = useState<Offer[]>([]);
    const router = useRouter();

    const columns: ColumnDef<Offer>[] = [
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
            accessorKey: "discountPercentage",
            header: "Discount (%)",
            cell: ({ row }) => <div>{row.getValue("discountPercentage")}</div>,
        },
        {
            accessorKey: "conditions.minQuantity",
            header: "Min Quantity",
            cell: ({ row }) => <div>{row.original.conditions?.minQuantity || "N/A"}</div>,
        },
        {
            accessorKey: "conditions.discountPerKg",
            header: "Discount per KG",
            cell: ({ row }) => <div>{row.original.conditions?.discountPerKg || "N/A"}</div>,
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ row }) => <div>{new Date(row.getValue("startDate")).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            cell: ({ row }) => <div>{new Date(row.getValue("endDate")).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "isActive",
            header: "Active",
            cell: ({ row }) => <div>{row.getValue("isActive") ? "Yes" : "No"}</div>,
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
                            Copy Offer ID
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={async () => await updateOfferStatus(row.original._id, { isActive: !row.original.isActive }).then(() => fetchData())}>
                            Mark {row.original.isActive ? "Inactive" : "Active"}
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/offers/${row.original._id}`)}>
                            View or Edit Offer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteOffer(row.original)}>
                            Delete Offer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            // const response = await getAllOffers();
            // setOffers(response?.offers);
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const deleteOffer = async (selectedRow: Offer) => {
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

    return <DataTable<Offer> columns={columns} data={data} filterField="discountPercentage" />;
}
