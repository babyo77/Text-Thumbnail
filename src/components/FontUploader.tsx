"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef } from "react";

interface FontUploaderProps {
  onFontLoaded: (fontName: string, fontFamily: string) => void;
}

/**
 * Lets the user upload a custom font (ttf, otf, woff, woff2)
 * and loads it via the FontFace API for CSS and Canvas usage.
 *
 * Calls onFontLoaded(fontKey, fontFamily) so you can add the loaded font to your font list.
 */
const FontUploader: React.FC<FontUploaderProps> = ({ onFontLoaded }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFontUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fontName = file.name.replace(/\.[^/.]+$/, ""); // remove extension

    const reader = new FileReader();
    reader.onload = async (e) => {
      // e.target!.result is a data URL (base64)
      const fontDataUrl = e.target?.result as string;
      try {
        // Try using FontFace API to add the font
        const fontFace = new FontFace(fontName, `url(${fontDataUrl})`);
        await fontFace.load();
        // Add font to document
        (document as any).fonts.add(fontFace);

        // Optionally, add a style tag for fallback in components (e.g., SelectItem preview)
        const style = document.createElement("style");
        style.innerHTML = `
          @font-face {
            font-family: '${fontName}';
            src: url('${fontDataUrl}');
          }
        `;
        document.head.appendChild(style);

        // Tell parent
        onFontLoaded(fontName, fontName);
      } catch (err) {
        alert("Failed to load font. Try another file?");
      }
      // Reset file input so user can re-upload same font
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Label htmlFor="custom_fonts" className=" -ml-2">
        <Button variant={"link"} size={"sm"} asChild>
          <p>Upload Custom Font</p>
        </Button>
      </Label>
      <Input
        ref={inputRef}
        type="file"
        hidden
        id="custom_fonts"
        accept=".ttf,.otf,.woff,.woff2"
        onChange={handleFontUpload}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
      />
    </div>
  );
};

export default FontUploader;
