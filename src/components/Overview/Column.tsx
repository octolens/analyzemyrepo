import React from "react";

interface OverViewSectionColumnsProps {
  children: React.ReactNode;
  column_title: string;
}

const OverviewSectionColumn = ({
  children,
  column_title,
}: OverViewSectionColumnsProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="font-bold text-2xl">{column_title}</h3>
      {children}
    </div>
  );
};

export default OverviewSectionColumn;
