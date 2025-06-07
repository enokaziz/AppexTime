declare module 'react-native-qrcode-svg' {
  import { SvgProps } from 'react-native-svg';

  interface QRCodeProps extends SvgProps {
    value: string;
    size: number;
    color: string;
    backgroundColor: string;
    logo?: string;
    logoSize?: number;
    quietZone?: number;
    quietZoneColor?: string;
  }

  export default class QRCode extends React.Component<QRCodeProps> {
    toDataURL: (callback: (dataUrl: string) => void) => void;
  }
}
