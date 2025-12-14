// Authentication and Form Validation Utilities

import { AUTH_VALIDATION } from "@/lib/types"

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []

  if (!email || email.trim().length === 0) {
    errors.push("Email is required")
    return { valid: false, errors }
  }

  const trimmed = email.trim()

  if (trimmed.length < AUTH_VALIDATION.email.minLength) {
    errors.push(`Email must be at least ${AUTH_VALIDATION.email.minLength} characters`)
  }

  if (trimmed.length > AUTH_VALIDATION.email.maxLength) {
    errors.push(`Email must be less than ${AUTH_VALIDATION.email.maxLength} characters`)
  }

  if (!AUTH_VALIDATION.email.pattern.test(trimmed)) {
    errors.push("Please enter a valid email address")
  }

  return { valid: errors.length === 0, errors }
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []

  if (!password) {
    errors.push("Password is required")
    return { valid: false, errors }
  }

  if (password.length < AUTH_VALIDATION.password.minLength) {
    errors.push(`Password must be at least ${AUTH_VALIDATION.password.minLength} characters`)
  }

  if (password.length > AUTH_VALIDATION.password.maxLength) {
    errors.push(`Password must be less than ${AUTH_VALIDATION.password.maxLength} characters`)
  }

  if (AUTH_VALIDATION.password.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (AUTH_VALIDATION.password.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (AUTH_VALIDATION.password.requireNumber && !/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return { valid: errors.length === 0, errors }
}

export function validateFullName(name: string): ValidationResult {
  const errors: string[] = []

  if (!name || name.trim().length === 0) {
    errors.push("Full name is required")
    return { valid: false, errors }
  }

  const trimmed = name.trim()

  if (trimmed.length < AUTH_VALIDATION.fullName.minLength) {
    errors.push(`Name must be at least ${AUTH_VALIDATION.fullName.minLength} characters`)
  }

  if (trimmed.length > AUTH_VALIDATION.fullName.maxLength) {
    errors.push(`Name must be less than ${AUTH_VALIDATION.fullName.maxLength} characters`)
  }

  return { valid: errors.length === 0, errors }
}

export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  const errors: string[] = []

  if (!confirmPassword) {
    errors.push("Please confirm your password")
    return { valid: false, errors }
  }

  if (password !== confirmPassword) {
    errors.push("Passwords do not match")
  }

  return { valid: errors.length === 0, errors }
}

// Validate all signup fields
export function validateSignupForm(data: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}): { valid: boolean; fieldErrors: Record<string, string[]> } {
  const fieldErrors: Record<string, string[]> = {}

  const nameResult = validateFullName(data.fullName)
  if (!nameResult.valid) fieldErrors.fullName = nameResult.errors

  const emailResult = validateEmail(data.email)
  if (!emailResult.valid) fieldErrors.email = emailResult.errors

  const passwordResult = validatePassword(data.password)
  if (!passwordResult.valid) fieldErrors.password = passwordResult.errors

  const confirmResult = validateConfirmPassword(data.password, data.confirmPassword)
  if (!confirmResult.valid) fieldErrors.confirmPassword = confirmResult.errors

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  }
}

// Validate all login fields
export function validateLoginForm(data: {
  email: string
  password: string
}): { valid: boolean; fieldErrors: Record<string, string[]> } {
  const fieldErrors: Record<string, string[]> = {}

  const emailResult = validateEmail(data.email)
  if (!emailResult.valid) fieldErrors.email = emailResult.errors

  if (!data.password) {
    fieldErrors.password = ["Password is required"]
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  }
}
