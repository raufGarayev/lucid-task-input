import React, { useState, useEffect, useRef } from 'react'
import './FormulaInput.css'
import { TagElement } from '../../store/formulaStore'
import useAutocomplete, { Suggestion } from '../../hooks/useAutoComplete'

interface TagEditorProps {
  tag: TagElement
  onClose: () => void
  onUpdate: (newValue: string) => void
}

const TagEditor: React.FC<TagEditorProps> = ({ tag, onClose, onUpdate }) => {
  const [inputValue, setInputValue] = useState<string>(tag.value)
  const { data: suggestions = [] } = useAutocomplete(inputValue)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(0)
  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (inputRef.current) {
      inputRef.current.focus()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value)
    setSelectedSuggestionIndex(0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter') {
      if (suggestions && suggestions.length > 0) {
        onUpdate(suggestions[selectedSuggestionIndex].id)
      } else {
        onUpdate(inputValue)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (suggestions && suggestions.length > 0) {
        setSelectedSuggestionIndex(
          prevIndex => (prevIndex + 1) % suggestions.length
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (suggestions && suggestions.length > 0) {
        setSelectedSuggestionIndex(
          prevIndex => (prevIndex - 1 + suggestions.length) % suggestions.length
        )
      }
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion): void => {
    onUpdate(suggestion.id)
  }

  return (
    <div className='tag-editor' ref={editorRef}>
      <div className='tag-editor-content'>
        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className='tag-editor-input'
          autoFocus
        />

        {suggestions && suggestions.length > 0 && (
          <div className='tag-editor-suggestions'>
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id}
                className={`tag-editor-suggestion ${
                  index === selectedSuggestionIndex
                    ? 'tag-editor-suggestion-selected'
                    : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className='suggestion-display'>{suggestion.display}</div>
                <div className='suggestion-description'>
                  {suggestion.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TagEditor
