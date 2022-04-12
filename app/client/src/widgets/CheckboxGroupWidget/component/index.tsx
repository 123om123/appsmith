import React from "react";
import styled from "styled-components";

import { Classes } from "@blueprintjs/core";
import { ComponentProps } from "widgets/BaseComponent";
import { ThemeProp } from "components/ads/common";
import { generateReactKey } from "utils/generators";
import { Checkbox } from "components/wds";

// TODO(abstraction-issue): this needs to be a common import from somewhere in the platform
// Alternatively, they need to be replicated.
import { OptionProps, SelectAllState, SelectAllStates } from "../constants";
import { Colors } from "constants/Colors";

export interface CheckboxGroupContainerProps {
  inline?: boolean;
  optionCount: number;
  valid?: boolean;
  optionAlignment?: string;
}

const CheckboxGroupContainer = styled.div<
  ThemeProp & CheckboxGroupContainerProps
>`
  display: ${({ inline }) => (inline ? "inline-flex" : "flex")};
  ${({ inline }) => `
    flex-direction: ${inline ? "row" : "column"};
    align-items: ${inline ? "center" : "flex-start"};
    ${inline && "flex-wrap: wrap"};
  `}
  justify-content: ${({ inline, optionAlignment, optionCount }) =>
    !!optionAlignment
      ? optionAlignment
      : optionCount > 1
      ? `space-between`
      : inline
      ? `flex-start`
      : `center`};
  width: 100%;
  height: 100%;
  overflow: auto;
  border: 1px solid transparent;
  ${({ theme, valid }) =>
    !valid &&
    `
    border: 1px solid ${theme.colors.error};
  `}

  .${Classes.CONTROL} {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    margin: 0px 12px;
  }

  & .select-all {
    white-space: nowrap;
    color: ${Colors.GREY_9} !important;
  }
`;

export interface SelectAllProps {
  checked: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  inline?: boolean;
  onChange: React.FormEventHandler<HTMLInputElement>;
  rowSpace: number;
  backgroundColor: string;
  borderRadius: string;
}

function SelectAll(props: SelectAllProps) {
  const {
    backgroundColor,
    borderRadius,
    checked,
    disabled,
    indeterminate,
    inline,
    onChange,
  } = props;
  return (
    <Checkbox
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      checked={checked}
      className="select-all"
      disabled={disabled}
      indeterminate={indeterminate}
      inline={inline}
      label="Select All"
      onChange={onChange}
    />
  );
}

export interface CheckboxGroupComponentProps extends ComponentProps {
  isDisabled?: boolean;
  isInline?: boolean;
  isSelectAll?: boolean;
  isRequired?: boolean;
  isValid?: boolean;
  onChange: (value: string) => React.FormEventHandler<HTMLInputElement>;
  onSelectAllChange: (
    state: SelectAllState,
  ) => React.FormEventHandler<HTMLInputElement>;
  options: OptionProps[];
  rowSpace: number;
  selectedValues: string[];
  optionAlignment?: string;
  backgroundColor: string;
  borderRadius: string;
}
function CheckboxGroupComponent(props: CheckboxGroupComponentProps) {
  const {
    isDisabled,
    isInline,
    isSelectAll,
    isValid,
    onChange,
    onSelectAllChange,
    optionAlignment,
    options,
    rowSpace,
    selectedValues,
  } = props;

  const selectAllChecked = selectedValues.length === options.length;
  const selectAllIndeterminate =
    !selectAllChecked && selectedValues.length >= 1;
  const selectAllState = selectAllChecked
    ? SelectAllStates.CHECKED
    : selectAllIndeterminate
    ? SelectAllStates.INDETERMINATE
    : SelectAllStates.UNCHECKED;

  return (
    <CheckboxGroupContainer
      data-cy="checkbox-group-container"
      inline={isInline}
      optionAlignment={optionAlignment}
      optionCount={options.length}
      valid={isValid}
    >
      {isSelectAll && (
        <SelectAll
          backgroundColor={props.backgroundColor}
          borderRadius={props.borderRadius}
          checked={selectAllChecked}
          disabled={isDisabled}
          indeterminate={selectAllIndeterminate}
          inline={isInline}
          onChange={onSelectAllChange(selectAllState)}
          rowSpace={rowSpace}
        />
      )}
      {options &&
        options.length > 0 &&
        [...options].map((option: OptionProps) => (
          <Checkbox
            backgroundColor={props.backgroundColor}
            borderRadius={props.borderRadius}
            checked={(selectedValues || []).includes(option.value)}
            disabled={isDisabled}
            inline={isInline}
            key={generateReactKey()}
            label={option.label}
            onChange={onChange(option.value)}
          />
        ))}
    </CheckboxGroupContainer>
  );
}

export default CheckboxGroupComponent;
