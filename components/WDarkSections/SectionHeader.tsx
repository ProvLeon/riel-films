import React from "react";

interface SectionHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <h2 className={`text-2xl leading-[50px] tracking-[3px] ${className}`}>
      {children}
    </h2>
  );
};

export default SectionHeader;
