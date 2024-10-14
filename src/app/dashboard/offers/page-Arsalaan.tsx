"use client"
import { DataTable } from "@/components/global/dataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAllOffers, toggleOffer } from "@/services/offer.service";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export type Offer = {
    _id: string;
    productIds: [{
        product: string,
        productName: string,
    }]; // Keep this for backend
    discountPercentage?: number;
    flatDiscount?: number;
    conditions?: {
        minQuantity?: number;
        discountPerVal?: number;
    };
    startDate: Date;
    endDate: Date;
    code?: string;
    isActive: boolean;
};

export default function Offers() {
    const [data, setOffers] = useState<Offer[]>([]);
    const router = useRouter();

    const columns: ColumnDef<Offer>[] = [
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
            accessorKey: "code",
            header: "Name / Code",
            cell: ({ row }) => <div className="text-center">{row?.original?.code}</div>, // Display product names
        },
        {
            accessorKey: "productNames",
            header: "Products",
            cell: ({ row }) => <div className="text-center">{row?.original?.productIds.map((product, i) => (`${product.productName}${row?.original?.productIds.length - 1 > i ? ' ,' : ''}`))}</div>, // Display product names
        },
        {
            accessorKey: "discountPercentage",
            header: "Discount (%)",
            cell: ({ row }) => <div className="text-center">{row.original.discountPercentage || "N/A"}</div>,
        },
        {
            accessorKey: "flatDiscount",
            header: "Flat Discount (%)",
            cell: ({ row }) => <div className="text-center">{row.original.flatDiscount || "N/A"}</div>,
        },
        {
            accessorKey: "conditions.minQuantity",
            header: "Min Quantity",
            cell: ({ row }) => <div className="text-center">{row.original.conditions?.minQuantity || "N/A"}</div>,
        },
        {
            accessorKey: "conditions.discountPerVal",
            header: "Discount per KG",
            cell: ({ row }) => <div className="text-center">{row.original.conditions?.discountPerVal || "N/A"}</div>,
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ row }) => <div className="text-center">{new Date(row.getValue("startDate")).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "endDate",
            header: "End Date",
            cell: ({ row }) => <div className="text-center">{new Date(row.getValue("endDate")).toLocaleDateString()}</div>,
        },
        {
            accessorKey: "isActive",
            header: "Active",
            cell: ({ row }) => <div className="text-center">{row.getValue("isActive") ? "Yes" : "No"}</div>,
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
                        <DropdownMenuItem
                            onClick={async () =>
                                await toggleOffer(row.original._id, {
                                    isActive: !row.original?.isActive,
                                }).then(() => fetchData())
                            }
                        >
                             {row.original.isActive ? `Deactivate` : "Activate"} Offer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/offers/${row.original._id}`)}>
                            View or Edit Offer
                        </DropdownMenuItem>
                        {/* <DropdownMenuSeparator /> */}
                        {/* <DropdownMenuItem onClick={() => deleteOffer(row.original)}>
                            Delete Offer
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const response = await getAllOffers();
            setOffers(response?.offers); // Set the new offers state
        } catch (error) {
            console.error("Error fetching offers:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteOffer = async (selectedRow: Offer) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you cannot recover this offer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                // Uncomment and implement the delete offer logic
                // await deleteOfferById(selectedRow._id);
                // fetchData();
                Swal.fire("Deleted!", "The offer has been deleted.", "success");
            } catch (error) {
                console.error("Error deleting offer:", error);
                Swal.fire("Error", "An error occurred while deleting the offer.", "error");
            }
        }
    };

    const createNewOffer = () => {
        router.push("/dashboard/offers/new");
    }

    return <DataTable<Offer> columns={columns} data={data} onCreateRecord={createNewOffer} filterField="discountPercentage" />;
}
