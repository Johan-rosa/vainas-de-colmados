"use client"

import type React from "react"

import { useState, useRef, useEffect, type ChangeEvent, forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface EnhancedNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label?: string
  helperText?: string
  error?: string
  prefix?: string
  suffix?: string
  allowDecimals?: boolean
  decimalPlaces?: number
  value?: string | number
  onChange?: (value: string, formattedValue: string) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  className?: string
  inputClassName?: string
  labelClassName?: string
  helperTextClassName?: string
  errorClassName?: string
}

const EnhancedNumberInput = forwardRef<HTMLInputElement, EnhancedNumberInputProps>(
  (
    {
      label,
      helperText,
      error,
      prefix,
      suffix,
      allowDecimals = true,
      decimalPlaces,
      value: propValue = "",
      onChange,
      onBlur,
      className,
      inputClassName,
      labelClassName,
      helperTextClassName,
      errorClassName,
      disabled,
      required,
      id,
      name,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<string>(propValue.toString())
    const [formattedValue, setFormattedValue] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)
    const [cursorPosition, setCursorPosition] = useState<number | null>(null)
    const inputId = id || `number-input-${Math.random().toString(36).substring(2, 9)}`

    // Format number with commas
    const formatNumber = (num: string): string => {
      // Remove any non-digit characters except for decimal point
      const cleanNum = allowDecimals ? num.replace(/[^\d.]/g, "") : num.replace(/[^\d]/g, "")

      // Handle decimal numbers
      if (cleanNum.includes(".") && allowDecimals) {
        const [integerPart, decimalPart] = cleanNum.split(".")
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        // Apply decimal places limit if specified
        const limitedDecimal = decimalPlaces !== undefined ? decimalPart.slice(0, decimalPlaces) : decimalPart

        return `${formattedInteger}.${limitedDecimal}`
      }

      // Format integer with commas
      return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    // Handle input change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Store cursor position
      const currentPosition = e.target.selectionStart

      // Get input value without commas, prefix, and suffix
      let rawValue = e.target.value
      if (prefix) rawValue = rawValue.replace(prefix, "")
      if (suffix) rawValue = rawValue.replace(suffix, "")
      rawValue = rawValue.replace(/,/g, "")

      // Validate input
      if (allowDecimals) {
        // Allow only one decimal point
        const decimalCount = (rawValue.match(/\./g) || []).length
        if (decimalCount > 1) {
          rawValue = rawValue.replace(/\./g, (match, index) => (index === rawValue.indexOf(".") ? match : ""))
        }
      } else {
        // Remove decimal points if not allowed
        rawValue = rawValue.replace(/\./g, "")
      }

      setValue(rawValue)

      // Calculate cursor position adjustment
      const beforeFormatting = e.target.value
      const afterFormatting = prefix
        ? prefix + formatNumber(rawValue) + (suffix || "")
        : formatNumber(rawValue) + (suffix || "")

      // Calculate how many commas are before the cursor in the formatted value
      const commasBefore = (beforeFormatting.substring(0, currentPosition || 0).match(/,/g) || []).length
      const prefixLength = prefix ? prefix.length : 0

      const newCommasBefore = (
        afterFormatting
          .substring(
            prefixLength,
            (currentPosition || 0) -
              commasBefore +
              prefixLength +
              (afterFormatting.length - beforeFormatting.replace(/,/g, "").length),
          )
          .match(/,/g) || []
      ).length

      // Adjust cursor position based on commas and prefix
      const adjustment = newCommasBefore - commasBefore + (currentPosition === 0 && prefix ? prefix.length : 0)
      setCursorPosition(currentPosition !== null ? currentPosition + adjustment : null)

      // Call parent onChange if provided
      if (onChange) {
        onChange(rawValue, afterFormatting)
      }
    }

    // Handle blur event
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Format to fixed decimal places on blur if specified
      if (decimalPlaces !== undefined && allowDecimals && value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".")
        const formattedDecimal = decimalPart.padEnd(decimalPlaces, "0").slice(0, decimalPlaces)
        const newValue = `${integerPart}.${formattedDecimal}`
        setValue(newValue)
      }

      if (onBlur) {
        onBlur(e)
      }
    }

    // Update formatted value when raw value or prefix/suffix changes
    useEffect(() => {
      const formatted = formatNumber(value)
      setFormattedValue(prefix ? prefix + formatted + (suffix || "") : formatted + (suffix || ""))
    }, [value, prefix, suffix])

    // Update internal value when prop value changes
    useEffect(() => {
      if (propValue.toString() !== value) {
        setValue(propValue.toString())
      }
    }, [propValue])

    // Restore cursor position after formatting
    useEffect(() => {
      if (cursorPosition !== null && inputRef.current) {
        inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
      }
    }, [formattedValue, cursorPosition])

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={inputId} className={cn(labelClassName)}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        <Input
          id={inputId}
          ref={inputRef || ref}
          type="text"
          inputMode="numeric"
          value={formattedValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={cn(
            "text-right",
            error && "border-destructive focus-visible:ring-destructive",
            inputClassName,
          )}
          name={name}
          required={required}
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className={cn("text-sm text-destructive", errorClassName)}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className={cn("text-sm text-muted-foreground", helperTextClassName)}>
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

EnhancedNumberInput.displayName = "EnhancedNumberInput"

export default EnhancedNumberInput;