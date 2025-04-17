// src/components/ui/Button.jsx
import React from 'react';
import './Button.css';

/**
 * Button component for consistent styling
 * @param {object} props
 * @param {string} props.variant - Button variant (primary, secondary, etc.)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.isFullWidth - Whether button takes full width
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {ReactNode} props.children - Button content
 * @param {string} props.type - Button type attribute
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  onClick,
  disabled = false,
  children,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        btn 
        btn-${variant} 
        btn-${size}
        ${isFullWidth ? 'btn-full-width' : ''}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;