"use client"
import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Product {
  _id:string,
  name: string,
  totalSold: number,
  revenue: number
}

type Props = {
  products:Product[];
};

const BestSellingProducts = ({ products }: Props) => {
  const columns: ColumnDef<Product>[] = [
    // {
    //   accessorKey: "_id",
    //   header: "Id",
    // },
    {
      accessorKey: "name",
      header: "Product",
    },
    {
      accessorKey: "totalSold",
      header: "Units Sold",
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
    },
  ]
  const table = useReactTable({
    data:products,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border p-5">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Best Selling Products</h3>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns?.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}


//   return (
//     <div className="bg-white p-6 rounded-lg shadow-lg">
//     <h3 className="text-2xl font-bold text-gray-800 mb-4">Best Selling Products</h3>
//     <table className="min-w-full border-collapse border border-gray-200">
//       <thead>
//         <tr className="bg-gray-100">
//           <th className="px-4 py-2 text-left text-gray-700 font-semibold">Product Name</th>
//           <th className="px-4 py-2 text-left text-gray-700 font-semibold">Total Units Sold</th>
//           <th className="px-4 py-2 text-left text-gray-700 font-semibold">Revenue Generated</th>
//         </tr>
//       </thead>
//       <tbody>
//         {products?.map((product, index) => (
//           <tr key={index} className="border-b transition duration-300 hover:bg-gray-100">
//             <td className="px-4 py-2 text-gray-700">{product.name}</td>
//             <td className="px-4 py-2 text-gray-600">{product.totalSold}</td>
//             <td className="px-4 py-2 text-gray-600">${product.revenue.toFixed(2)}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
  

//   );
// };

export default BestSellingProducts;
