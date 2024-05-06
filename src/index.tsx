import { VisionCameraProxy, type Frame } from 'react-native-vision-camera';

type BoundingFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
  boundingCenterX: number;
  boundingCenterY: number;
};
type Point = { x: number; y: number };

type TextElement = {
  text: string;
  frame: BoundingFrame;
  cornerPoints: Point[];
};

type TextLine = {
  text: string;
  elements: TextElement[];
  frame: BoundingFrame;
  recognizedLanguages: string[];
  cornerPoints: Point[];
};

type TextBlock = {
  text: string;
  lines: TextLine[];
  frame: BoundingFrame;
  recognizedLanguages: string[];
  cornerPoints: Point[];
};

type Text = {
  text: string;
  blocks: TextBlock[];
};

export type OCRFrame = {
  result: Text;
};

const plugin = VisionCameraProxy.initFrameProcessorPlugin('scanOCR', {});

/**
 * Scans OCR.
 */

export function scanOCR(frame: Frame): OCRFrame {
  'worklet';
  return plugin?.call(frame) as unknown as OCRFrame;
}
