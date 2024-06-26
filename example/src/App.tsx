/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';

import { Worklets } from 'react-native-worklets-core';
import {
  StyleSheet,
  View,
  Text,
  type LayoutChangeEvent,
  PixelRatio,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { type OCRFrame, scanOCR } from 'vision-camera-ocr';
import {
  useCameraDevice,
  useFrameProcessor,
  Camera,
} from 'react-native-vision-camera';

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [ocr, setOcr] = React.useState<OCRFrame>();
  const [pixelRatio, setPixelRatio] = React.useState<number>(1);
  const device = useCameraDevice('back');

  const onOcrScanned = Worklets.createRunOnJS(setOcr);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const data = scanOCR(frame);
    onOcrScanned(data);
  }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const renderOverlay = () => {
    return (
      <>
        {ocr?.result.blocks.map((block) => {
          return (
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(block.text);
                Alert.alert(`"${block.text}" copied to the clipboard`);
              }}
              style={{
                position: 'absolute',
                left: block.frame.x * pixelRatio,
                top: block.frame.y * pixelRatio,
                backgroundColor: 'white',
                padding: 8,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                {block.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  return device !== undefined && hasPermission ? (
    <>
      <Camera
        style={[StyleSheet.absoluteFill]}
        frameProcessor={frameProcessor}
        device={device}
        isActive={true}
        fps={5}
        onLayout={(event: LayoutChangeEvent) => {
          setPixelRatio(
            event.nativeEvent.layout.width /
              PixelRatio.getPixelSizeForLayoutSize(
                event.nativeEvent.layout.width
              )
          );
        }}
      />
      {renderOverlay()}
    </>
  ) : (
    <View>
      <Text>No available cameras</Text>
    </View>
  );
}
