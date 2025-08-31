import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type Props = {
  handler: () => void;
  isVisible: boolean;
};

export const PassVisibilityToggler = ({ handler, isVisible }: Props) => (
  <button
    className="outline-transparent focus:outline-solid"
    type="button"
    onClick={handler}
    aria-label="toggle password visibility"
  >
    {isVisible ? (
      <EyeSlashIcon className="text-default-400 size-6" />
    ) : (
      <EyeIcon className="text-default-400 size-6" />
    )}
  </button>
);
