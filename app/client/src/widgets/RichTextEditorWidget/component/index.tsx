import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Editor } from "@tinymce/tinymce-react";
import { LabelPosition, LABEL_MAX_WIDTH_RATE } from "components/constants";
import { Alignment, Classes, Label, Position } from "@blueprintjs/core";
import {
  FontStyleTypes,
  TextSize,
  TEXT_SIZES,
} from "constants/WidgetConstants";
import Tooltip from "components/ads/Tooltip";
import { Colors } from "constants/Colors";
import {
  addLabelTooltipEventListeners,
  hasLabelEllipsis,
  removeLabelTooltipEventListeners,
} from "widgets/WidgetUtils";

const StyledRTEditor = styled.div<{
  compactMode: boolean;
  labelPosition?: LabelPosition;
  isValid?: boolean;
}>`
  && {
    width: 100%;
    height: 100%;
    border: 1px solid
      ${(props) => (props.isValid ? "none" : Colors.DANGER_SOLID)};
    .tox .tox-editor-header {
      z-index: 0;
    }
  }
  .tox {
    width: 100%;
    .tox-tbtn {
      cursor: pointer;
      .tox-tbtn__select-label {
        cursor: inherit;
      }
    }
  }

  display: flex;
  flex-direction: ${({ compactMode, labelPosition }) => {
    if (labelPosition === LabelPosition.Left) return "row";
    if (labelPosition === LabelPosition.Top) return "column";
    if (compactMode) return "row";
    return "column";
  }};
  align-items: ${({ compactMode, labelPosition }) => {
    if (labelPosition === LabelPosition.Top) return "flex-start";
    if (compactMode) return "center";
    return "flex-start";
  }};
  ${({ compactMode, labelPosition }) =>
    ((labelPosition !== LabelPosition.Left && !compactMode) ||
      labelPosition === LabelPosition.Top) &&
    `overflow-x: hidden; overflow-y: auto;`}

  label.rich-text-editor-label {
    ${({ compactMode, labelPosition }) => {
      if (labelPosition === LabelPosition.Top)
        return "margin-bottom: 5px; margin-right: 0px";
      if (compactMode || labelPosition === LabelPosition.Left)
        return "margin-bottom: 0px; margin-right: 5px";
      return "margin-bottom: 5px; margin-right: 0px";
    }};
  }
`;

export const TextLabelWrapper = styled.div<{
  compactMode: boolean;
  alignment?: Alignment;
  position?: LabelPosition;
  width?: number;
}>`
  display: flex;
  ${({ alignment, compactMode, position, width }) => `
    ${
      position !== LabelPosition.Top &&
      (position === LabelPosition.Left || compactMode)
        ? `&&& {margin-right: 5px; flex-shrink: 0;} max-width: ${LABEL_MAX_WIDTH_RATE}%;`
        : `width: 100%;`
    }
    ${position === LabelPosition.Left &&
      `
      ${!width && `width: 33%`};
      ${alignment === Alignment.RIGHT && `justify-content: flex-end`};
      label {
        ${width && `width: ${width}px`};
        ${
          alignment === Alignment.RIGHT
            ? `text-align: right`
            : `text-align: left`
        };
      }
    `}
  `}
`;

export const StyledLabel = styled(Label)<{
  $disabled: boolean;
  $labelText?: string;
  $labelTextColor?: string;
  $labelTextSize?: TextSize;
  $labelStyle?: string;
  disabled?: boolean;
}>`
  overflow-y: hidden;
  text-overflow: ellipsis;
  text-align: left;
  color: ${(props) =>
    props.disabled ? Colors.GREY_8 : props.$labelTextColor || "inherit"};
  font-size: ${(props) =>
    props.$labelTextSize ? TEXT_SIZES[props.$labelTextSize] : "14px"};
  font-weight: ${(props) =>
    props?.$labelStyle?.includes(FontStyleTypes.BOLD) ? "bold" : "normal"};
  font-style: ${(props) =>
    props?.$labelStyle?.includes(FontStyleTypes.ITALIC) ? "italic" : ""};
`;

export const StyledTooltip = styled(Tooltip)`
  overflow: hidden;
`;

export const RichTextEditorInputWrapper = styled.div`
  display: flex;
  width: 100%;
  min-width: 0;
  height: 100%;
`;

export interface RichtextEditorComponentProps {
  value?: string;
  isMarkdown: boolean;
  placeholder?: string;
  widgetId: string;
  isDisabled: boolean;
  isVisible?: boolean;
  compactMode: boolean;
  isToolbarHidden: boolean;
  labelText: string;
  labelPosition?: LabelPosition;
  labelAlignment?: Alignment;
  labelWidth?: number;
  labelTextColor?: string;
  labelTextSize?: TextSize;
  labelStyle?: string;
  isValid?: boolean;
  onValueChange: (valueAsString: string) => void;
}
const initValue = "<p></p>";
export function RichtextEditorComponent(props: RichtextEditorComponentProps) {
  const {
    compactMode,
    isDisabled,
    labelAlignment,
    labelPosition,
    labelStyle,
    labelText,
    labelTextColor,
    labelTextSize,
    labelWidth,
    widgetId,
  } = props;

  const [isLabelTooltipEnabled, setIsLabelTooltipEnabled] = useState(false);
  const [isLabelTooltipOpen, setIsLabelTooltipOpen] = useState(false);

  const [value, setValue] = React.useState<string>(props.value as string);
  const editorRef = useRef<any>(null);
  const isInit = useRef<boolean>(false);

  const toolbarConfig =
    "insertfile undo redo | formatselect | bold italic backcolor forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | table | print preview media | forecolor backcolor emoticons' | help";

  useEffect(() => {
    if (!value && !props.value) return;
    // This Prevents calling onTextChange when initialized
    if (!isInit.current) return;
    const timeOutId = setTimeout(() => props.onValueChange(value), 1000);
    return () => clearTimeout(timeOutId);
  }, [value]);

  useEffect(() => {
    if (!editorRef.current) return;
    setValue(props.value as string);
  }, [props.value]);

  useEffect(() => {
    if (labelText && !isLabelTooltipEnabled) {
      addLabelTooltipEventListeners(
        `.appsmith_widget_${widgetId} .rich-text-editor-label`,
        handleMouseEnterOnLabel,
        handleMouseLeaveOnLabel,
      );
      setIsLabelTooltipEnabled(true);
    } else if (!labelText && isLabelTooltipEnabled) {
      setIsLabelTooltipEnabled(false);
    }
  }, [labelText]);

  useEffect(() => {
    return () =>
      removeLabelTooltipEventListeners(
        `.appsmith_widget_${widgetId} .rich-text-editor-label`,
        handleMouseEnterOnLabel,
        handleMouseLeaveOnLabel,
      );
  }, []);

  const handleMouseEnterOnLabel = useCallback(() => {
    if (
      hasLabelEllipsis(`.appsmith_widget_${widgetId} .rich-text-editor-label`)
    ) {
      setIsLabelTooltipOpen(true);
    }
  }, []);

  const handleMouseLeaveOnLabel = useCallback(() => {
    setIsLabelTooltipOpen(false);
  }, []);

  const onEditorChange = (newValue: string) => {
    // Prevents cursur shift in Markdown
    if (newValue === "" && props.isMarkdown) {
      setValue(initValue);
    } else {
      setValue(newValue);
    }
  };

  return (
    <StyledRTEditor
      className={`container-${props.widgetId}`}
      compactMode={compactMode}
      data-testid="rte-container"
      isValid={props.isValid}
      labelPosition={labelPosition}
    >
      {labelText && (
        <TextLabelWrapper
          alignment={labelAlignment}
          compactMode={compactMode}
          position={labelPosition}
          width={labelWidth}
        >
          <StyledTooltip
            content={labelText}
            hoverOpenDelay={200}
            isOpen={isLabelTooltipOpen}
            position={Position.TOP}
          >
            <StyledLabel
              $disabled={isDisabled}
              $labelStyle={labelStyle}
              $labelText={labelText}
              $labelTextColor={labelTextColor}
              $labelTextSize={labelTextSize}
              className={`rich-text-editor-label ${Classes.TEXT_OVERFLOW_ELLIPSIS}`}
              disabled={isDisabled}
            >
              {labelText}
            </StyledLabel>
          </StyledTooltip>
        </TextLabelWrapper>
      )}
      <RichTextEditorInputWrapper>
        <Editor
          disabled={props.isDisabled}
          id={`rte-${props.widgetId}`}
          init={{
            height: "100%",
            menubar: false,
            toolbar_mode: "sliding",
            forced_root_block: false,
            branding: false,
            resize: false,
            plugins: [
              "advlist autolink lists link image charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help",
            ],
          }}
          key={`editor_${props.isToolbarHidden}`}
          onEditorChange={onEditorChange}
          onInit={(evt, editor) => {
            editorRef.current = editor;
            isInit.current = true;
          }}
          tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.10.1/tinymce.min.js"
          toolbar={props.isToolbarHidden ? false : toolbarConfig}
          value={value}
        />
      </RichTextEditorInputWrapper>
    </StyledRTEditor>
  );
}

export default RichtextEditorComponent;
