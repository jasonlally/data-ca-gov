import { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';

interface TableProps {
  loading: boolean;
  columns: Array<any>;
  data: Array<any>;
  setPage: any;
  setPerPage: any;
  currentPage: number;
  perPage: number;
  totalPages: number;
  requestData: any;
}

const Table: React.FC<TableProps> = ({
  loading,
  columns,
  data,
  setPage,
  setPerPage,
  currentPage,
  perPage,
  totalPages,
  requestData,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    pageOptions,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      useControlledState: (state) => {
        return useMemo(
          () => ({
            ...state,
            pageIndex: currentPage,
          }),
          [state, currentPage]
        );
      },
      initialState: { pageIndex: currentPage }, // Pass our hoisted table state
      manualPagination: true,
      pageCount: totalPages,
    },
    usePagination
  );

  return (
    <>
      <table
        {...getTableProps()}
        className="border-separate border-spacing-0 table-auto"
      >
        <thead className="sticky top-0 text-white">
          {headerGroups.map((headerGroup, idx) => (
            <tr
              key={idx}
              {...headerGroup.getHeaderGroupProps()}
              className="sticky top-0"
            >
              {headerGroup.headers.map((column, idx) => (
                <th
                  key={idx}
                  {...column.getHeaderProps()}
                  className="sticky top-0 bg-primary border-solid border border-indigo-800 p-2"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            return (
              <tr key={idx} {...row.getRowProps()} className="odd:bg-blue-50">
                {row.cells.map((cell, idx) => {
                  return (
                    <td
                      key={idx}
                      {...cell.getCellProps()}
                      className="border-solid border border-gray-200 p-2"
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-between bg-blue-300 p-4 sticky bottom-0 left-0 right-0">
        <button
          onClick={() => {
            requestData(1, perPage);
          }}
          disabled={currentPage === 1}
        >
          first
        </button>{' '}
        <button
          onClick={() => {
            requestData((s) => (s === 0 ? 0 : s - 1), perPage);
          }}
          disabled={currentPage === 1}
        >
          prev
        </button>{' '}
        <button
          onClick={() => {
            requestData((s) => s + 1, perPage);
          }}
          disabled={currentPage === totalPages}
        >
          next
        </button>{' '}
        <button
          onClick={() => {
            requestData(totalPages, perPage);
          }}
          disabled={currentPage === totalPages}
        >
          last
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex} of {pageOptions.length}
          </strong>{' '}
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex}
            min="1"
            max={totalPages}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) : 1;
              requestData(page, perPage);
            }}
            className="w-20 border-2 rounded px-2"
          />
        </span>{' '}
        <select
          value={perPage}
          onBlur={(e) => {
            requestData(currentPage, Number(e.target.value));
          }}
        >
          {[100, 200, 500].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize} records
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Table;
