import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/**
 * Resusable komponen tabel untuk menampilkan data secara general.
 *
 * @param {Object} props - Properti untuk komponen DataTable.
 * @param {Array<Object>} props.data - Array objek data yang akan ditampilkan di tabel.
 * @param {Array<Object>} props.columns - Definisi kolom tabel. Setiap objek kolom harus memiliki:
 * - {string} key: Property key data yang akan ditampilkan di kolom ini.
 * - {string} header: Teks header kolom.
 * - {function(Object): React.ReactNode} [render]: Function opsional untuk merender sel secara custom.
 * @param {boolean} props.loading - Menunjukkan apakah data sedang dimuat.
 * @param {string|null} props.error - Pesan error jika terjadi kesalahan saat memuat data.
 * @param {function(Object): void} [props.onRowClick] - Function yang dipanggil saat baris diklik.
 * @param {function(string|number): void} [props.onDeleteClick] - Function yang dipanggil saat tombol delete diklik.
 * @param {string} [props.idKey='id'] - Unique key untuk setiap item data (default 'id').
 */

const DataTable = ({
  data,
  columns,
  loading,
  error,
  onRowClick,
  onDeleteClick,
  idKey = "id", // default key for unique identification
}) => {
  // --- RENDERING LOADING STATE ---
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[40px] w-full rounded-md" />
        <Skeleton className="h-[40px] w-full rounded-md" />
        <Skeleton className="h-[40px] w-full rounded-md" />
        <Skeleton className="h-[40px] w-full rounded-md" />
        <Skeleton className="h-[40px] w-full rounded-md" />
      </div>
    );
  }

  // --- RENDERING ERROR STATE ---
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Something went wrong.</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          {columns.map((column, index) => (
            <TableHead key={column.key || index} className={column.className}>
              {column.header}
            </TableHead>
          ))}
          {(onRowClick || onDeleteClick) && (
            <TableHead className="text-center">Action</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + (onRowClick || onDeleteClick ? 2 : 1)}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, rowIndex) => (
            <TableRow
              key={item[idKey] || rowIndex} // use idKey for unique key, fallback to rowIndex
              onClick={() => onRowClick && onRowClick(item)}
              className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
            >
              <TableCell className="font-medium">{rowIndex + 1}</TableCell>
              {columns.map((column, colIndex) => (
                <TableCell key={column.key || colIndex}>
                  {column.render ? column.render(item) : item[column.key]}
                </TableCell>
              ))}
              {(onRowClick || onDeleteClick) && (
                <TableCell className="text-center">
                  {onDeleteClick && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent onRowClick from firing
                        onDeleteClick(item[idKey]); // pass the item's unique ID
                      }}
                    >
                      Delete
                    </Button>
                  )}
                  {/* {onRowClick && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick(item); // Treat row click as edit
                      }}
                    >
                      Edit
                    </Button>
                  )} */}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
