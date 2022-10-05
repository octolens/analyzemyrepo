const SimpleTable = ({
  rows,
  column_name,
}: {
  rows: JSX.Element[];
  column_name: string;
}) => {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              {column_name}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((element: JSX.Element) => (
            <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
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
