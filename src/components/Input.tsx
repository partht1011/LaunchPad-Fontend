import { InputProps } from '../types/props';

const Input: React.FC<InputProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between">
      <label className="text-grey-bright font-semibold">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter information"
        className="w-64 p-2 rounded-lg bg-dark border border-grey-bright/10 text-white placeholder-white/10  outline-none focus:border-grey-bright/50"
      />
    </div>
  );
};
export default Input;
