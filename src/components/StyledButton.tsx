import React from 'react';
import styled, { keyframes } from 'styled-components';

const borderTravel = keyframes`
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 200% 0%;
  }
`;

const StyledButtonWrapper = styled.button`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    padding: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      transparent,
      rgba(0, 157, 255, 0.8),
      transparent,
      transparent
    );
    background-size: 200% 100%;
    animation: ${borderTravel} 3s linear infinite;
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  box-shadow: 
    0 0 2px rgba(0, 157, 255, 0.2),
    inset 0 0 2px rgba(0, 157, 255, 0.1);
  
  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
    
    &:before {
      background: linear-gradient(
        90deg,
        transparent,
        transparent,
        rgba(0, 157, 255, 1),
        transparent,
        transparent
      );
      animation: ${borderTravel} 2s linear infinite;
    }
  }

  &:active {
    transform: translateY(0px);
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.9;
  }
`;

interface StyledButtonProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const StyledButton: React.FC<StyledButtonProps> = ({ 
  icon, 
  children, 
  onClick,
  className 
}) => {
  return (
    <StyledButtonWrapper onClick={onClick} className={className}>
      {icon}
      {children}
    </StyledButtonWrapper>
  );
};

export default StyledButton;
