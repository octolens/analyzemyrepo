const RadioHorizontal = ({
  radio_names,
  active_radio_name,
  setRadioName,
  id_modifier,
}: {
  radio_names: string[];
  active_radio_name: string;
  setRadioName: (x: any) => any;
  id_modifier: string;
}) => {
  return (
    <div className="flex flex-col md:flex-row mx-auto items-center gap-2">
      {radio_names.map((value: string, index: number) => {
        return (
          <div
            className="flex items-center mr-4"
            key={`radio-input-${id_modifier}=${index}`}
          >
            <input
              id={`inline-radio-${index}-${id_modifier}`}
              type="radio"
              name={`inline-radio-group-${id_modifier}`}
              checked={value == active_radio_name}
              onChange={() => setRadioName(value)}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-black"
            />
            <label
              htmlFor={`inline-radio-${index}-${id_modifier}`}
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              {value}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioHorizontal;
