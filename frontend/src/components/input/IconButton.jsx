import React from "react";

const IconButton = ({
  label,
  onClick,
  className = "",
  children,
  iconClassName = "",
  ...props
}) => {
  const updatedChildren = React.cloneElement(children, {
    className: `${
      children.props.className || ""
    } md:w-5 md:h-5 w-2 h-2 ${iconClassName}`,
  });

  return (
    <button
      className={`px-2 md:px-4 bg-primary text-white md:text-md text-sm h-10 py-2 rounded-lg flex items-center gap-2 ${className}`}
      onClick={onClick}
      {...props}
    >
      {updatedChildren}
      <span>{label}</span>
    </button>
  );
};

export default IconButton;
