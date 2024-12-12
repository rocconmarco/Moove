import React, { useState } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InfoIconProps {
  text: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ text }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FontAwesomeIcon icon={faInfoCircle} size="sm" />
      {showTooltip && <div className="absolute z-10 w-64 bg-gray-800 text-white p-2 rounded-md shadow-lg">{text}</div>}
    </div>
  );
};

export default InfoIcon;
