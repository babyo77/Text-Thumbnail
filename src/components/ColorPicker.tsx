'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const defaultColors = [
  '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF',
  '#F5A623', '#F8E71C', '#8B572A', '#7ED321',
  '#417505', '#BD10E0', '#9013FE', '#4A90E2',
  '#50E3C2', '#B8E986', '#007AFF', '#5856D6',
  '#FF2D55', '#FF3B30', '#FF9500', '#FFCC00',
  '#4CD964', '#34C759'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  presetColors = defaultColors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false); // Close popover after selection
  };
  
  return (
    <div className="relative">
      {/* Color Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-md border border-gray-300 dark:border-gray-700 cursor-pointer transition-transform hover:scale-105 shadow-sm"
        style={{ backgroundColor: value }}
        aria-label="Select color"
      />

      {/* Popover */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute z-10 top-full mt-2 w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          {/* Preset Colors Grid */}
          <div className="grid grid-cols-6 gap-2 mb-4">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 cursor-pointer transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>

          <hr className="border-gray-200 dark:border-gray-600 my-3" />

          {/* Custom Color Picker */}
          <div className="flex items-center space-x-3">
             <label htmlFor="custom-color" className="relative cursor-pointer w-8 h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 flex items-center justify-center">
                <input
                    type="color"
                    id="custom-color"
                    value={value}
                    // We use `onInput` for live updates as the user drags the picker
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
                    className="opacity-0 w-full h-full absolute cursor-pointer"
                />
            </label>
            <div className="flex-grow">
                 <label htmlFor="hex-code" className="text-xs text-gray-500 dark:text-gray-400">HEX</label>
                 <div className="relative flex items-center">
                    <span className="absolute left-3 text-gray-400 dark:text-gray-500">#</span>
                    <input
                        type="text"
                        id="hex-code"
                        value={value.substring(1).toUpperCase()}
                        onChange={(e) => onChange(`#${e.target.value}`)}
                        className="w-full pl-7 pr-2 py-1.5 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};