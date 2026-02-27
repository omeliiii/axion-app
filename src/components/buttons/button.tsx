import {
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  ReactNode,
  Ref,
  RefAttributes,
  forwardRef,
} from "react";

type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode,
) => (props: P & RefAttributes<T>) => ReactNode;

const fixedForwardRef = forwardRef as FixedForwardRef;

type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any
  ? Omit<T, TOmitted>
  : never;

export const UnwrappedAnyComponent = <T extends ElementType>(
  props: {
    as?: T;
    label?: string;
  } & DistributiveOmit<
    ComponentPropsWithRef<ElementType extends T ? "button" : T>,
    "as"
  >,
  ref: ForwardedRef<any>,
) => {
  const { as: Comp = "button", label, children, className, ...rest } = props;

  return (
    <Comp {...rest} ref={ref} className={`button ${className}`}>
      {label && <span>{label}</span>}
      {children}
    </Comp>
  );
};

export const Button = fixedForwardRef(UnwrappedAnyComponent);
