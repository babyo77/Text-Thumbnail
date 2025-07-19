"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import UndoRedoManager from "@/utils/UndoRedoManager";
import Dropzone from "./dropzone";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "@/components/ui/button";
import { IoMdArrowBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { fonts as initialFonts } from "./fonts";
import { initialTextElement } from "@/lib/utils";
import FontUploader from "@/components/FontUploader";
import { ColorPicker } from "@/components/ColorPicker";

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  opacity: number;
  font: string;
  color: string;
  fontWeight?: number;
  letterSpacing?: number;
  rotation?: number;
  rotationY?: number;
  textTransform?: "none" | "uppercase" | "lowercase";
  is3D?: boolean;
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  textShadow?: string;
}

const ThumbnailCreator = () => {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(
    null,
  );
  const [canvasReady, setCanvasReady] = useState(false);
  const undoRedoManager = useRef(
    new UndoRedoManager({
      textElements: [initialTextElement],
      selectedTextId: "1",
    }),
  );
  const [textElements, setTextElements] = useState<TextElement[]>([
    initialTextElement,
  ]);
  const [selectedTextId, setSelectedTextId] = useState("1");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseOnCanvas, setIsMouseOnCanvas] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const setSelectedImage = async (file?: File) => {
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const src = e.target?.result as string;
        setImageSrc(src);

        const blob = await removeBackground(src);
        const processedUrl = URL.createObjectURL(blob);
        setProcessedImageSrc(processedUrl);
        setCanvasReady(true);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCompositeImage = useCallback(() => {
    if (!canvasRef.current || !canvasReady || !imageSrc || !processedImageSrc)
      return;

    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new Image();

    bgImg.onload = () => {
      // Set fixed large canvas dimensions
      canvas.width = 3840;
      canvas.height = 2160;

      // Draw background image scaled to fit canvas while maintaining aspect ratio
      const scale = Math.min(
        canvas.width / bgImg.width,
        canvas.height / bgImg.height,
      );
      const x = (canvas.width - bgImg.width * scale) / 2;
      const y = (canvas.height - bgImg.height * scale) / 2;
      ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);

      // Draw each text element
      textElements.forEach((textElement) => {
        ctx.save();

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let selectFont =
          textElement.font in fonts
            ? fonts[textElement.font as keyof typeof fonts]
            : "arial";

        ctx.font = `${textElement.fontWeight || 400} ${textElement.fontSize}px ${selectFont}`;
        ctx.fillStyle = textElement.color;
        ctx.globalAlpha = textElement.opacity;

        const x = (canvas.width * textElement.x) / 100;
        const y = (canvas.height * textElement.y) / 100;

        // Apply transformations
        ctx.translate(x, y);
        if (textElement.rotation) {
          ctx.rotate((textElement.rotation * Math.PI) / 180);
        }
        if (textElement.rotationY) {
          ctx.scale(Math.cos((textElement.rotationY * Math.PI) / 180), 1);
        }

        // Apply letter spacing if set
        if (textElement.letterSpacing) {
          ctx.letterSpacing = `${textElement.letterSpacing}px`;
        }
        ctx.fillText(textElement.text, 0, 0);

        // No visual selection indicator

        ctx.restore();
      });

      const fgImg = new Image();
      fgImg.onload = () => {
        // Draw foreground image with the same scaling as background
        const scale = Math.min(
          canvas.width / fgImg.width,
          canvas.height / fgImg.height,
        );
        const x = (canvas.width - fgImg.width * scale) / 2;
        const y = (canvas.height - fgImg.height * scale) / 2;
        ctx.drawImage(fgImg, x, y, fgImg.width * scale, fgImg.height * scale);
      };

      fgImg.src = processedImageSrc;
    };

    bgImg.src = imageSrc;
  }, [
    canvasReady,
    imageSrc,
    processedImageSrc,
    textElements,
    selectedTextId,
    isMouseOnCanvas,
    mousePosition,
    isDragging,
  ]);

  useEffect(() => {
    if (canvasReady) {
      drawCompositeImage();
    }
  }, [canvasReady, drawCompositeImage]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDragging) {
        setIsDragging(false);
      }

      // Undo - Ctrl+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "z" &&
        !e.shiftKey
      ) {
        e.preventDefault();
        const prevState = undoRedoManager.current.undo();
        if (prevState) {
          setTextElements(prevState.textElements);
          setSelectedTextId(prevState.selectedTextId);
        }
      }

      // Redo - Ctrl+Y or Ctrl+Shift+Z
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" ||
          (e.key.toLowerCase() === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        const nextState = undoRedoManager.current.redo();
        if (nextState) {
          setTextElements(nextState.textElements);
          setSelectedTextId(nextState.selectedTextId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isDragging, textElements, selectedTextId]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const addTextElement = () => {
    saveHistory();
    const newId = Date.now().toString();
    const newTextElement: TextElement = {
      id: newId,
      text: "New Text",
      x: 50,
      y: 50,
      fontSize: 300,
      opacity: 1,
      font: "arial",
      color: "rgba(255, 255, 255, 1)",
    };
    setTextElements([...textElements, newTextElement]);
    setSelectedTextId(newId);
  };

  const duplicateTextElement = (id: string) => {
    const textToDuplicate = textElements.find((t) => t.id === id);
    if (textToDuplicate) {
      const newId = Date.now().toString();
      const duplicatedText: TextElement = {
        ...textToDuplicate,
        id: newId,
        x: textToDuplicate.x + 10,
        y: textToDuplicate.y + 10,
      };
      setTextElements([...textElements, duplicatedText]);
      setSelectedTextId(newId);
    }
  };

  const saveHistory = () => {
    undoRedoManager.current.pushState({
      textElements,
      selectedTextId,
    });
  };

  const removeTextElement = (id: string) => {
    if (textElements.length > 1) {
      saveHistory();
      const newTextElements = textElements.filter((t) => t.id !== id);
      setTextElements(newTextElements);
      setSelectedTextId(newTextElements[0].id);
    }
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    // Save history for all updates except continuous position changes
    const isPositionUpdate = "x" in updates || "y" in updates;
    if (!isPositionUpdate || !isDragging) {
      saveHistory();
    }
    setTextElements(
      textElements.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const selectedText = textElements.find((t) => t.id === selectedTextId);

  // Store fonts in state (allows dynamic addition of new fonts)
  const [fonts, setFonts] = useState<{ [key: string]: string }>(initialFonts);

  const handleFontLoaded = (fontKey: string, fontFamily: string) => {
    setFonts((prev) => ({
      ...prev,
      [fontKey]: fontFamily,
    }));
  };

  const resetTextElements = () => {
    const defaultText: TextElement = {
      id: "1",
      text: "POV",
      x: 50,
      y: 50,
      fontSize: 100,
      opacity: 1,
      font: "arial",
      color: "rgba(255, 255, 255, 1)",
    };
    setTextElements([defaultText]);
    setSelectedTextId("1");
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setMousePosition({ x, y });

    // If dragging, update the selected text position
    if (isDragging && selectedText) {
      const xPercent = (x / canvas.width) * 100;
      const yPercent = (y / canvas.height) * 100;

      // Only update position if it actually changed
      if (
        Math.abs(selectedText.x - xPercent) > 0.1 ||
        Math.abs(selectedText.y - yPercent) > 0.1
      ) {
        updateTextElement(selectedTextId, {
          x: xPercent,
          y: yPercent,
        });
      }
    }

    // Redraw canvas in real-time
    requestAnimationFrame(() => {
      drawCompositeImage();
    });
  };

  const handleCanvasMouseLeave = () => {
    setIsMouseOnCanvas(false);
    // Redraw canvas to hide following text
    requestAnimationFrame(() => {
      drawCompositeImage();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // If currently dragging, stop dragging and save history
    if (isDragging) {
      saveHistory(); // Save final position in history
      setIsDragging(false);
      return;
    }

    // Check if click is on an existing text element
    const clickedTextElement = textElements.find((textElement) => {
      const textX = (canvas.width * textElement.x) / 100;
      const textY = (canvas.height * textElement.y) / 100;

      // Create a rough bounding box for the text
      const textWidth = textElement.text.length * (textElement.fontSize * 0.6);
      const textHeight = textElement.fontSize;

      return (
        x >= textX - textWidth / 2 &&
        x <= textX + textWidth / 2 &&
        y >= textY - textHeight / 2 &&
        y <= textY + textHeight / 2
      );
    });

    if (clickedTextElement) {
      // Select the clicked text element and start dragging
      saveHistory(); // Save state before starting drag
      setSelectedTextId(clickedTextElement.id);
      setIsDragging(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto items-center justify-start text-center p-5">
      {imageSrc ? (
        <>
          {loading ? (
            <div className="mt-15">
              <ShimmerLoader>Processing image</ShimmerLoader>
            </div>
          ) : (
            <div className="flex w-full items-start max-md:flex-wrap">
              <div className="my-4 flex w-full flex-col items-start gap-3">
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setProcessedImageSrc(null);
                    setCanvasReady(false);
                  }}
                  className="flex items-center gap-1 cursor-pointer self-start"
                >
                  <IoMdArrowBack className="size-4" />
                  <p className="leading-7 text-sm">Go back</p>
                </button>
                <canvas
                  ref={canvasRef}
                  className={`max-h-lg  h-auto w-full max-w-lg rounded-lg ${
                    isDragging ? "cursor-move" : "cursor-default"
                  }`}
                  title={
                    isDragging
                      ? "Click to drop text"
                      : "Click and drag text to move it"
                  }
                  onMouseMove={handleCanvasMouseMove}
                  // onMouseEnter={handleCanvasMouseEnter}
                  onMouseLeave={handleCanvasMouseLeave}
                  onClick={handleCanvasClick}
                ></canvas>
                <div className=" text-xs  text-start">
                  <p className="text-muted-foreground hidden md:block mb-4">
                    Click on existing text to select and drag it.
                  </p>
                </div>
              </div>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle />

                  <CardDescription className="flex flex-wrap gap-2">
                    <Button
                      onClick={addTextElement}
                      variant="outline"
                      size="sm"
                    >
                      Add Text
                    </Button>
                    <Button
                      onClick={resetTextElements}
                      variant="outline"
                      size="sm"
                    >
                      Reset All
                    </Button>
                    {textElements.map((textElement) => (
                      <Button
                        key={textElement.id}
                        onClick={() => setSelectedTextId(textElement.id)}
                        variant={
                          selectedTextId === textElement.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                      >
                        {textElement.text.substring(0, 10)}
                        {textElement.text.length > 10 ? "..." : ""}
                      </Button>
                    ))}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedText && (
                    <div className="grid w-full items-center gap-7">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="text">Text</Label>
                        <Input
                          value={selectedText.text}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            undoRedoManager.current.startSliding();
                            updateTextElement(selectedTextId, {
                              text: e.target.value,
                            });
                            undoRedoManager.current.endSliding({
                              textElements,
                              selectedTextId,
                            });
                          }}
                          id="text"
                          placeholder="Text in thumbnail"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="x-position">
                            X Position: {selectedText.x.toFixed(0)}%
                          </Label>
                          <Slider
                            value={[selectedText.x]}
                            onValueChange={(value) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                x: value[0],
                              });
                            }}
                            onValueCommit={() => {
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                            max={100}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="y-position">
                            Y Position: {selectedText.y.toFixed(0)}%
                          </Label>
                          <Slider
                            value={[selectedText.y]}
                            onValueChange={(value) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                y: value[0],
                              });
                            }}
                            onValueCommit={() => {
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                            max={100}
                            min={0}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="font-size">
                            Font Size: {selectedText.fontSize}px
                          </Label>
                          <Slider
                            value={[selectedText.fontSize]}
                            onValueChange={(value) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                fontSize: value[0],
                              });
                            }}
                            onValueCommit={() => {
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                            max={1000}
                            min={10}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="opacity">
                            Opacity: {Math.round(selectedText.opacity * 100)}%
                          </Label>
                          <Slider
                            value={[selectedText.opacity]}
                            onValueChange={(value) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                opacity: value[0],
                              });
                            }}
                            onValueCommit={() => {
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                            max={1}
                            min={0}
                            step={0.1}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="font-weight">
                            Font Weight: {selectedText.fontWeight}
                          </Label>
                          <Slider
                            value={[selectedText.fontWeight || 400]}
                            onValueChange={(value) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                fontWeight: value[0],
                              });
                            }}
                            onValueCommit={() => {
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                            max={900}
                            min={100}
                            step={100}
                            className="w-full"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="letter-spacing">
                            Letter Spacing: {selectedText.letterSpacing || 0}px
                          </Label>
                          <Slider
                            value={[selectedText.letterSpacing || 0]}
                            onValueChange={(value) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                letterSpacing: value[0],
                              });
                            }}
                            onValueCommit={() => {
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                            max={20}
                            min={-5}
                            step={0.5}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="rotation">
                            Rotation: {selectedText.rotation}°
                          </Label>
                          <Slider
                            value={[selectedText.rotation || 0]}
                            onValueChange={(value) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                rotation: value[0],
                              });
                            }}
                            onValueCommit={() => {
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                            max={360}
                            min={-360}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        {/* <div className="flex flex-col gap-2">
                          <Label htmlFor="rotation-3d">
                            3D Rotation: {selectedText.rotationY}°
                          </Label>
                          <Slider
                            value={[selectedText.rotationY || 0]}
                            onValueChange={(value) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                rotationY: value[0],
                              });
                            }}
                            onValueCommit={() => {
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                            max={180}
                            min={-180}
                            step={1}
                            className="w-full"
                          />
                        </div> */}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="font">Font</Label>
                          <Select
                            value={selectedText.font}
                            onValueChange={(value: string) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, {
                                font: value,
                              });
                              undoRedoManager.current.endSliding({
                                textElements,
                                selectedTextId,
                              });
                            }}
                          >
                            <SelectTrigger id="font" className=" w-full">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {/* Custom uploaded fonts at top, default fonts below */}
                              {Object.entries(fonts)
                                .filter(([key]) => !(key in initialFonts))
                                .map(([key, value]) => (
                                  <SelectItem
                                    style={{ fontFamily: value }}
                                    key={key}
                                    value={key}
                                  >
                                    <span style={{ fontFamily: value }}>
                                      {key}
                                    </span>
                                  </SelectItem>
                                ))}
                              {Object.entries(fonts)
                                .filter(([key]) => key in initialFonts)
                                .map(([key, value]) => (
                                  <SelectItem
                                    style={{ fontFamily: value }}
                                    key={key}
                                    value={key}
                                  >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                            <FontUploader onFontLoaded={handleFontLoaded} />
                          </Select>
                        </div>
                        <div className="flex flex-col gap-2 w-32">
                          <Label htmlFor="color">Text Color</Label>
                          <ColorPicker
                            value={selectedText.color.startsWith('#') ? selectedText.color : '#ffffff'}
                            onChange={(color) => {
                              undoRedoManager.current.startSliding();
                              updateTextElement(selectedTextId, { color });
                              undoRedoManager.current.endSliding({ textElements, selectedTextId });
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => duplicateTextElement(selectedTextId)}
                            variant="secondary"
                          >
                            Duplicate
                          </Button>
                          <Button variant="default" onClick={handleDownload}>
                            Download
                          </Button>
                        </div>
                        {textElements.length > 1 && (
                          <Button
                            onClick={() => removeTextElement(selectedTextId)}
                            variant="destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : (
        <>
          <h1 className="scroll-m-20 text-start pl-3 text-3xl font-semibold tracking-tight lg:text-5xl">
            Want to create a thumbnail?
          </h1>

          <Dropzone setSelectedImage={setSelectedImage} />
          <div className="columns-1 md:columns-3 space-y-4 p-4">
            <img
              src="/1.png"
              alt="Thumbnail"
              className="col-span-1 rounded-lg h-auto"
            />

            <img
              src="/3.png"
              alt="Thumbnail"
              className="col-span-1 rounded-lg h-auto"
            />
            <img
              src="/2.png"
              alt="Thumbnail"
              className="col-span-1 rounded-lg h-auto"
            />
          </div>
        </>
      )}
      <div className=" p-4 fixed top-3 right-2">
        <iframe
          src="https://github.com/sponsors/babyo77/button"
          title="Sponsor babyo77"
          height="32"
          width="114"
        ></iframe>
      </div>
    </div>
  );
};

function ShimmerLoader({ children }: { children: React.ReactNode }) {
  return (
    <div key="loader">
      <span className="text-xl font-medium text-[#a3a3a3] shimmer-text">
        {children}
      </span>
    </div>
  );
}
export default ThumbnailCreator;
