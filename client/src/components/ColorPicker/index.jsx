import React, { useCallback, useState, useEffect } from "react";

import "./index.css";

import { HexColorPicker, HexColorInput } from "react-colorful";

export const ColorPicker = ({color, setColor}) => {
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
      {/* <HexColorInput
        color={color}
        onChange={setColor}
        onClick={() => toggle(false)}
      /> */}

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
  );
};
