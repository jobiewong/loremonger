import * as ComboboxPrimitive from "@diceui/combobox";
import {
  IconCheckmark1 as Check,
  IconChevronDownMedium as ChevronDown,
  IconCrossMedium as X,
} from "central-icons";
import React from "react";

import { cn } from "~/lib/utils";

const Combobox = (({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Root>) => {
  return (
    <ComboboxPrimitive.Root
      data-slot="combobox"
      className={cn(className)}
      {...props}
    />
  );
}) as ComboboxPrimitive.ComboboxRootComponentProps;

function ComboboxLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Label>) {
  return (
    <ComboboxPrimitive.Label
      data-slot="combobox-label"
      className={cn("px-0.5 py-1.5 font-semibold text-sm", className)}
      {...props}
    />
  );
}

function ComboboxAnchor({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Anchor>) {
  return (
    <ComboboxPrimitive.Anchor
      data-slot="combobox-anchor"
      className={cn(
        "relative flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 data-focused:ring-1 data-focused:ring-ring",
        className
      )}
      {...props}
    />
  );
}

function ComboboxInput({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-input"
      className={cn(
        "flex h-9 w-full rounded-md bg-transparent text-base placeholder:text-muted-foreground focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger>) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn(
        "flex shrink-0 items-center justify-center border-input bg-transparent text-muted-foreground transition-colors hover:text-foreground/80 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children || <ChevronDown className="size-4" />}
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxCancel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Cancel>) {
  return (
    <ComboboxPrimitive.Cancel
      data-slot="combobox-cancel"
      className={cn(
        "-translate-y-1/2 absolute top-1/2 right-1 flex size-6 items-center justify-center rounded-sm bg-background opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

function ComboboxBadgeList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.BadgeList>) {
  return (
    <ComboboxPrimitive.BadgeList
      data-slot="combobox-badge-list"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  );
}

function ComboboxBadgeItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.BadgeItem>) {
  return (
    <ComboboxPrimitive.BadgeItem
      data-slot="combobox-badge-item"
      className={cn(
        "inline-flex items-center justify-between gap-1 rounded-sm bg-secondary px-2 py-0.5",
        className
      )}
      {...props}
    >
      <span className="truncate text-[13px] text-secondary-foreground">
        {children}
      </span>
      <ComboboxPrimitive.BadgeItemDelete
        data-slot="combobox-badge-item-delete"
        className="shrink-0 rounded p-0.5 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring data-highlighted:bg-destructive"
      >
        <X className="size-3" />
      </ComboboxPrimitive.BadgeItemDelete>
    </ComboboxPrimitive.BadgeItem>
  );
}

function ComboboxContent({
  sideOffset = 6,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Content>) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Content
        data-slot="combobox-content"
        sideOffset={sideOffset}
        className={cn(
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-fit min-w-(--dice-anchor-width) origin-(--dice-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
          className
        )}
        {...props}
      >
        {children}
      </ComboboxPrimitive.Content>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxLoading({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Loading>) {
  return (
    <ComboboxPrimitive.Loading
      data-slot="combobox-loading"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    >
      Loading...
    </ComboboxPrimitive.Loading>
  );
}

function ComboboxEmpty({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  );
}

function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn("overflow-hidden", className)}
      {...props}
    />
  );
}

function ComboboxGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-group-label"
      className={cn(
        "px-2 py-1.5 font-semibold text-muted-foreground text-xs",
        className
      )}
      {...props}
    />
  );
}

function ComboboxItem({
  className,
  children,
  outset,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Item> & {
  outset?: boolean;
}) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50",
        outset ? "pr-8 pl-2" : "pr-2 pl-8",
        className
      )}
      {...props}
    >
      <ComboboxPrimitive.ItemIndicator
        className={cn(
          "absolute flex size-3.5 items-center justify-center",
          outset ? "right-2" : "left-2"
        )}
      >
        <Check className="size-4" />
      </ComboboxPrimitive.ItemIndicator>
      <ComboboxPrimitive.ItemText>{children}</ComboboxPrimitive.ItemText>
    </ComboboxPrimitive.Item>
  );
}

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

interface ComboboxOption {
  label: string;
  value: string;
}

interface GroupedComboboxOption {
  groupLabel: string;
  options: ComboboxOption[];
}

interface ComboboxComponentProps {
  options: ComboboxOption[] | GroupedComboboxOption[];
  label?: string;
  name?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
}

function ComboboxComponent({
  options,
  name,
  label,
  placeholder,
  onValueChange,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Root> &
  ComboboxComponentProps) {
  const [value, setValue] = React.useState<string | undefined>(undefined);

  const isGrouped = (): boolean => {
    return (
      Array.isArray(options) && options.length > 0 && "groupLabel" in options[0]
    );
  };

  const contentList = (
    <ComboboxContent>
      <ComboboxEmpty>No options found.</ComboboxEmpty>
      {isGrouped() ? (
        (options as GroupedComboboxOption[]).map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            <ComboboxGroup>
              <ComboboxGroupLabel>{group.groupLabel}</ComboboxGroupLabel>
              {group.options.map((option) => (
                <ComboboxItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    void onValueChange?.(currentValue);
                  }}
                >
                  {option.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
            {groupIndex < options.length - 1 && <ComboboxSeparator />}
          </React.Fragment>
        ))
      ) : (
        <ComboboxGroup>
          {(options as ComboboxOption[]).map((option) => (
            <ComboboxItem
              key={option.value}
              value={option.value}
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue);
                void onValueChange?.(currentValue);
              }}
            >
              {option.label}
            </ComboboxItem>
          ))}
        </ComboboxGroup>
      )}
    </ComboboxContent>
  );

  return (
    <Combobox value={value} onValueChange={setValue} {...props}>
      {label && <ComboboxLabel htmlFor={name}>{label}</ComboboxLabel>}
      <ComboboxAnchor>
        <ComboboxInput
          id={name}
          placeholder={placeholder ?? "Select option..."}
        />
        <ComboboxTrigger>
          <ChevronDown className="size-4" />
        </ComboboxTrigger>
      </ComboboxAnchor>
      {contentList}
    </Combobox>
  );
}

export {
  Combobox,
  ComboboxAnchor,
  ComboboxBadgeItem,
  ComboboxBadgeList,
  ComboboxCancel,
  ComboboxComponent,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxLoading,
  ComboboxSeparator,
  ComboboxTrigger,
};
