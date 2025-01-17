import { useState } from "react";
import PropTypes from "prop-types";

import "./index.css";

import { HexColorPicker } from "react-colorful";

export const ColorPicker = ({ color, setColor }) => {
  const [isOpen, toggle] = useState(false);

  return (
    <div className="picker">
      <div
        className="swatch"
        style={{
          backgroundColor: color,
        }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div className="popover">
          <HexColorPicker
            color={color}
            onChange={setColor}
            onMouseLeave={() => toggle(false)}
          />
        </div>
      )}
    </div>
  )
};

ColorPicker.propTypes = {
  color: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired,
};

