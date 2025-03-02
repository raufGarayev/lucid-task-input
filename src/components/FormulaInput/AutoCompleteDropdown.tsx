import React from 'react'
import './FormulaInput.css'
import { Suggestion } from '../../hooks/useAutoComplete'

interface Position {
  top: number
  left: number
}

interface AutocompleteDropdownProps {
  suggestions: Suggestion[]
  selectedIndex: number
  onSelect: (suggestion: Suggestion) => void
  onHoverChange: (index: number) => void
  position?: Position
}

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  onHoverChange,
  position
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null
  }

  const handleSuggestionClick = (suggestion: Suggestion): void => {
    onSelect(suggestion)
  }

  const handleMouseEnter = (index: number): void => {
    onHoverChange(index)
  }

  return (
    <div
      className='autocomplete-dropdown'
      style={
        position
          ? {
              top: `${position.top}px`,
              left: `${position.left}px`
            }
          : {}
      }
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.id}
          className={`autocomplete-suggestion ${
            index === selectedIndex ? 'autocomplete-suggestion-selected' : ''
          }`}
          onClick={() => handleSuggestionClick(suggestion)}
          onMouseEnter={() => handleMouseEnter(index)}
        >
          <div className='suggestion-display'>{suggestion.display}</div>
          <div className='suggestion-description'>{suggestion.description}</div>
        </div>
      ))}
    </div>
  )
}

export default AutocompleteDropdown
