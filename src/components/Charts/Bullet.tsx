import { ResponsiveBullet } from "@nivo/bullet";

const calculate_title_offset = (value: number | string) => {
  const str = value.toString();
  if (str.length == 1) {
    return -30;
  }

  if (str.length == 2) {
    return -33;
  }

  if (str.length == 3) {
    return -35;
  }
};

const BulletChart = ({
  title,
  measures,
  markers,
  className = "",
  id = "Data",
  ranges,
  maxValue,
  minValue,
  titlePosition = "before",
  margin = { right: 30, bottom: 20, left: 10, top: 20 },
  titleOffsetX,
}: {
  title: string | number;
  measures: number[];
  markers: number[];
  className?: string;
  id?: string;
  ranges: number[];
  maxValue: number;
  minValue: number;
  titlePosition?: "before" | "after";
  margin?: Record<string, number>;
  titleOffsetX?: number;
}) => {
  return (
    <div className={className}>
      <ResponsiveBullet
        data={[
          {
            id: id,
            ranges: ranges,
            title: (
              <text dy={6}>
                <tspan className={`text-black font-extrabold`}>{title}</tspan>
              </text>
            ),
            measures: measures,
            markers: markers,
          },
        ]}
        maxValue={maxValue}
        minValue={minValue}
        spacing={46}
        titleAlign="start"
        measureSize={0.1}
        titleOffsetX={titleOffsetX ?? calculate_title_offset(title)}
        animate={true}
        margin={margin}
        markerSize={1.3}
        rangeColors="red_yellow_green"
        measureColors="black"
        markerColors="black"
        titlePosition={titlePosition}
      />
    </div>
  );
};

export default BulletChart;
