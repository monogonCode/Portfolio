import React from 'react';
import * as PAI from 'pixelarticons/react/index.js';

export interface PixelIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const createPixelIcon = (Component: React.ComponentType<any>) => {
  const IconWrapper: React.FC<PixelIconProps> = ({
    size = 16,
    color = 'currentColor',
    className,
    style
  }) => {
    return (
      <Component
        width={size}
        height={size}
        fill={color}
        className={className}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          flexShrink: 0,
          ...style
        }}
      />
    );
  };
  return IconWrapper;
};

// Re-export all necessary pixel-art icons from PixelArtIcons
export const PixelFolder = createPixelIcon(PAI.Folder);
export const PixelFileText = createPixelIcon(PAI.FileText);
export const PixelFile = createPixelIcon(PAI.File);
export const PixelTerminal = createPixelIcon(PAI.Terminal);
export const PixelSettings = createPixelIcon(PAI.Settings2);
export const PixelMail = createPixelIcon(PAI.Mail);
export const PixelMailRight = createPixelIcon(PAI.MailRight);
export const PixelGamepad = createPixelIcon(PAI.Gamepad);
export const PixelVolume2 = createPixelIcon(PAI.Volume2);
export const PixelVolumeX = createPixelIcon(PAI.VolumeX);
export const PixelDownload = createPixelIcon(PAI.Download);
export const PixelPower = createPixelIcon(PAI.Power);
export const PixelCirclePower = createPixelIcon(PAI.CirclePower);
export const PixelPrinter = createPixelIcon(PAI.Printer);
export const PixelZoomIn = createPixelIcon(PAI.ZoomIn);
export const PixelZoomOut = createPixelIcon(PAI.ZoomOut);
export const PixelCheck = createPixelIcon(PAI.Check);
export const PixelCheckDouble = createPixelIcon(PAI.CheckDouble);
export const PixelBriefcase = createPixelIcon(PAI.Briefcase);
export const PixelBookOpen = createPixelIcon(PAI.BookOpen);
export const PixelCode = createPixelIcon(PAI.Code);
export const PixelGlobe = createPixelIcon(PAI.Globe);
export const PixelSmartphone = createPixelIcon(PAI.Smartphone);
export const PixelSearch = createPixelIcon(PAI.Search);
export const PixelPlay = createPixelIcon(PAI.Play);
export const PixelEye = createPixelIcon(PAI.Eye);
export const PixelZap = createPixelIcon(PAI.Zap);
export const PixelServer = createPixelIcon(PAI.Server);
export const PixelGitBranch = createPixelIcon(PAI.GitBranch);
export const PixelLayout = createPixelIcon(PAI.Layout);
export const PixelShoppingBag = createPixelIcon(PAI.ShoppingBag);
export const PixelShoppingCart = createPixelIcon(PAI.ShoppingCart);
export const PixelStore = createPixelIcon(PAI.Store);
export const PixelMusic = createPixelIcon(PAI.Music);
export const PixelMapPin = createPixelIcon(PAI.MapPin);
export const PixelFlag = createPixelIcon(PAI.Flag);
export const PixelBomb = createPixelIcon(PAI.Bomb);
export const PixelSmile = createPixelIcon(PAI.Smile);
export const PixelSkull = createPixelIcon(PAI.Skull);
export const PixelSun = createPixelIcon(PAI.Sun);
export const PixelTrophy = createPixelIcon(PAI.Trophy);
export const PixelUser = createPixelIcon(PAI.User);
export const PixelPhone = createPixelIcon(PAI.Phone);
export const PixelGithub = createPixelIcon(PAI.Github);
export const PixelLinkedin = createPixelIcon(PAI.Linkedin);
export const PixelCamera = createPixelIcon(PAI.Camera);
export const PixelBarcode = createPixelIcon(PAI.Barcode);
export const PixelMonitor = createPixelIcon(PAI.Monitor);
export const PixelTv = createPixelIcon(PAI.Tv);
export const PixelSliders = createPixelIcon(PAI.Sliders);
export const PixelSparkles = createPixelIcon(PAI.Sparkles);
export const PixelImage = createPixelIcon(PAI.Image);
export const PixelBuilding = createPixelIcon(PAI.Building);
export const PixelClock = createPixelIcon(PAI.Clock);
export const PixelMessage = createPixelIcon(PAI.Message);
export const PixelSquareAlert = createPixelIcon(PAI.SquareAlert);
export const PixelArrowLeft = createPixelIcon(PAI.ArrowLeft);
export const PixelArrowRight = createPixelIcon(PAI.ArrowRight);
export const PixelReload = createPixelIcon(PAI.Reload);
export const PixelHome = createPixelIcon(PAI.Home);
export const PixelClose = createPixelIcon(PAI.Close);
export const PixelExternalLink = createPixelIcon(PAI.ExternalLink);
export const PixelLock = createPixelIcon(PAI.Lock);

export const PixelLanguage: React.FC<PixelIconProps> = ({
  size = 16,
  color = 'currentColor',
  className,
  style
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{
      display: 'inline-block',
      verticalAlign: 'middle',
      flexShrink: 0,
      ...style
    }}
  >
    {/* Top-left speech/character tile with 'A' */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 1H10V9H3V11H2V9H1V1ZM2 2H9V8H2V2ZM4 3H7V4H8V7H7V6H4V7H3V4H4V3ZM4 4V5H7V4H4Z"
      fill={color}
    />
    {/* Bottom-right overlapping translation tile with pixel script lines */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 6H15V14H14V15H13V14H6V10H7V13H14V7H11V6ZM9 9H13V10H11V12H10V10H9V9Z"
      fill={color}
    />
  </svg>
);

