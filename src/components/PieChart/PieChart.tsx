import React, { useState } from "react";
import Pie, { ProvidedProps, PieArcDatum } from "@visx/shape/lib/shapes/Pie";
import { scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { GradientOrangeRed } from "@visx/gradient";
import { animated, useTransition, to } from "@react-spring/web";

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export type PieProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
  data: Record<string, any>[];
  data_display_name: string;
  data_number_name: string;
};

export default function PieChart({
  width,
  height,
  margin = defaultMargin,
  animate = true,
  data,
  data_display_name,
  data_number_name,
}: PieProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 50;

  const get_value = (d: Record<string, any>): number => d[data_number_name];
  const get_display_name = (d: Record<string, any>): string =>
    d[data_display_name];

  const display_names = data.map(get_display_name);

  // 10 contributors and the last is other
  if (data.length > 11) {
    return null;
  }

  const base_color = "rgba(211, 84, 0)";
  // the last element in data should be other

  const generate_color_range = (data: PieProps["data"]): string[] => {
    let x: string[] = [];
    const start = 1;
    const end = 0.1;
    const len = data.length - 1;
    const step = (start - end) / len;

    for (let i = 0; i < len; i++) {
      x.push(`${base_color.slice(0, -1)}, ${start - i * step})`);
    }
    x.push("rgba(0, 0, 0, 1)");
    return x;
  };

  const getColors = scaleOrdinal({
    domain: display_names,
    range: generate_color_range(data),
  });

  const total_sum = data
    .map(get_value)
    .reduce((prev: number, curr: number) => prev + curr);

  return (
    <svg width={width} height={height}>
      <GradientOrangeRed id="visx-pie-gradient" />
      <rect
        rx={14}
        width={width}
        height={height}
        fill="url('#visx-pie-gradient')"
      />
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <Pie
          data={
            selectedUser
              ? data.filter((d) => d[data_display_name] === selectedUser)
              : data
          }
          pieValue={get_value}
          pieSortValues={(a, b) => (a < b ? 1 : -1)}
          outerRadius={radius - donutThickness * 1.3}
        >
          {(pie) => (
            <AnimatedPie<Record<string, any>>
              {...pie}
              animate={animate}
              getKey={({ data }) => `${get_display_name(data)}`}
              onClickDatum={({ data }) =>
                animate &&
                setSelectedUser(
                  selectedUser && selectedUser === get_display_name(data)
                    ? null
                    : get_display_name(data)
                )
              }
              getColor={({ data }) => getColors(get_display_name(data))}
            />
          )}
        </Pie>
      </Group>
      {animate && (
        <text
          textAnchor="end"
          x={width - 16}
          y={height - 16}
          fill="white"
          fontSize={11}
          fontWeight={300}
          pointerEvents="none"
        >
          Click segments to update
        </text>
      )}
    </svg>
  );
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // enter from 360° if end angle is > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props: any, arc: any, { key }: { key: any }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={to(
            [props.startAngle, props.endAngle],
            (startAngle: any, endAngle: any) =>
              path({
                ...arc,
                startAngle,
                endAngle,
              })
          )}
          fill={getColor(arc)}
          onClick={() => onClickDatum(arc)}
          onTouchStart={() => onClickDatum(arc)}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={15}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}
