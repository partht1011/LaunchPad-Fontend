import { TokenLogoProps } from '../types/props';

const TokenLogo = ({ src }: TokenLogoProps) => {
  return (
    <div className="w-[80px] h-[80px] rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
      <img src={src} className="w-full h-full object-cover" />
    </div>
  );
};

export default TokenLogo;
