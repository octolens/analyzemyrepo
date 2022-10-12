const SimpleTable = ({
  rows,
  column_name,
  header = true,
  alternate_colors = false,
}: {
  rows: JSX.Element[];
  column_name: string;
  header?: boolean;
  alternate_colors?: boolean;
}) => {
  return (
    <div className="overflow-x-auto relative sm:rounded-lg shadow-md">
      <table className="w-fit text-sm text-left text-gray-500 dark:text-gray-400">
        {header ? (
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                {column_name}
              </th>
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((element: JSX.Element, index: number) => (
            <tr
              className={
                "bg-white border-b dark:bg-gray-900 dark:border-gray-700" +
                (alternate_colors ? " odd:bg-gray-200" : "")
              }
              key={`simple-table-row-${index}`}
            >
              <th
                scope="row"
                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {element}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleTable;
