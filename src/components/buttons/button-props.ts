interface ButtonMandatoryProps {
  text: string;
}

interface ButtonOptionalProps {
  iconPath: string | undefined;
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export type ButtonProps = ButtonMandatoryProps & Partial<ButtonOptionalProps>;
