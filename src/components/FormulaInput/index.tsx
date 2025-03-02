import React, { useState, useRef, useEffect } from 'react'
import Tag from './Tag'
import useFormulaStore, { TagElement } from '../../store/formulaStore'
import AutocompleteDropdown from './AutoCompleteDropdown'
import useAutocomplete, { Suggestion } from '../../hooks/useAutoComplete'
import './FormulaInput.css'

interface Position {
  top: number
  left: number
}

const FormulaInput: React.FC = () => {
  const {
    formulaElements,
    cursorPosition,
    currentInput,
    result,
    addElement,
    removeElement,
    updateElement,
    setCursorPosition,
    setCurrentInput,
    calculateResult,
    clearFormula
  } = useFormulaStore()

  const [inputValue, setInputValue] = useState<string>('')
  const [dropdownPosition, setDropdownPosition] = useState<Position>()
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  const { data: suggestions = [] } = useAutocomplete(currentInput)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (cursorRef.current && currentInput) {
      const rect = cursorRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left
      })
    }
  }, [cursorPosition, currentInput])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value

    setInputValue(value)

    if (/^\d+$/.test(value)) {
      setCurrentInput('')
    } else {
      setCurrentInput(value)
      setSelectedSuggestionIndex(0)
    }
  }

  const handleInputBlur = (): void => {
    if (/^\d+$/.test(inputValue) && inputValue.length > 0) {
      addElement({
        type: 'number',
        value: inputValue
      })
      setInputValue('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (currentInput && suggestions.length > 0) {
        const selectedSuggestion = suggestions[selectedSuggestionIndex]
        addElement({
          type: 'tag',
          value: selectedSuggestion.id,
          display: selectedSuggestion.display
        })
      } else if (/^\d+$/.test(inputValue)) {
        addElement({
          type: 'number',
          value: inputValue
        })
      }

      setInputValue('')
      setCurrentInput('')
    } else if (
      /^\d+$/.test(inputValue) &&
      (e.key === ' ' || ['+', '-', '*', '/', '^', '(', ')'].includes(e.key))
    ) {
      e.preventDefault()

      addElement({
        type: 'number',
        value: inputValue
      })

      if (e.key !== ' ') {
        addElement({
          type: 'operator',
          value: e.key
        })
      }

      setInputValue('')
      setCurrentInput('')

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
    } else if (e.key === 'Backspace' && !inputValue && cursorPosition > 0) {
      e.preventDefault()
      removeElement(cursorPosition - 1)
    } else if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault()
      setSelectedSuggestionIndex(
        prevIndex => (prevIndex + 1) % suggestions.length
      )
    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault()
      setSelectedSuggestionIndex(
        prevIndex => (prevIndex - 1 + suggestions.length) % suggestions.length
      )
    } else if (e.key === 'ArrowLeft' && !inputValue && cursorPosition > 0) {
      e.preventDefault()
      setCursorPosition(cursorPosition - 1)
    } else if (
      e.key === 'ArrowRight' &&
      !inputValue &&
      cursorPosition < formulaElements.length
    ) {
      e.preventDefault()
      setCursorPosition(cursorPosition + 1)
    } else if (
      ['+', '-', '*', '/', '^', '(', ')'].includes(e.key) &&
      !inputValue
    ) {
      e.preventDefault()
      addElement({
        type: 'operator',
        value: e.key
      })

      setInputValue('')
      setCurrentInput('')

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setInputValue('')
      setCurrentInput('')
    } else if (
      /^\d+$/.test(inputValue) &&
      ['+', '-', '*', '/', '^', '(', ')'].includes(e.key)
    ) {
      e.preventDefault()

      addElement({
        type: 'number',
        value: inputValue
      })

      addElement({
        type: 'operator',
        value: e.key
      })

      setInputValue('')
      setCurrentInput('')

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 0)
    }
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const clickX = e.clientX - containerRect.left

      let closestPos = 0
      let closestDist = Infinity

      formulaElements.forEach((_, index) => {
        const element = document.getElementById(`formula-element-${index}`)
        const elRect = element?.getBoundingClientRect()

        if (elRect) {
          const leftDist = Math.abs(elRect.left - containerRect.left - clickX)
          if (leftDist < closestDist) {
            closestDist = leftDist
            closestPos = index
          }

          const rightDist = Math.abs(elRect.right - containerRect.left - clickX)
          if (rightDist < closestDist) {
            closestDist = rightDist
            closestPos = index + 1
          }
        }
      })

      setCursorPosition(closestPos)
      setInputValue('')
      setCurrentInput('')
    }
  }

  const handleSuggestionSelect = (suggestion: Suggestion): void => {
    addElement({
      type: 'tag',
      value: suggestion.id,
      display: suggestion.display
    })
    setInputValue('')
    setCurrentInput('')
  }

  const handleTagUpdate = (index: number, newTag: TagElement): void => {
    updateElement(index, newTag)
  }

  const handleCalculate = (): void => {
    calculateResult()

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  const handleClear = (): void => {
    clearFormula()
    setInputValue('')
    setCurrentInput('')

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 0)
  }

  const renderFormulaElements = (): React.ReactNode => {
    const elementsWithoutCursors = formulaElements.map((element, index) => {
      if (element.type === 'tag') {
        return (
          <div key={`element-${index}`} id={`formula-element-${index}`}>
            <Tag
              tag={element as TagElement}
              index={index}
              onUpdate={handleTagUpdate}
              isSelected={cursorPosition === index}
            />
          </div>
        )
      } else if (element.type === 'operator') {
        return (
          <div
            key={`element-${index}`}
            id={`formula-element-${index}`}
            className='formula-operator'
          >
            {element.value}
          </div>
        )
      } else if (element.type === 'number') {
        return (
          <div
            key={`element-${index}`}
            id={`formula-element-${index}`}
            className='formula-number'
          >
            {element.value}
          </div>
        )
      }
      return null
    })

    const result = []

    for (let i = 0; i <= elementsWithoutCursors.length; i++) {
      if (i === cursorPosition) {
        result.push(
          <div key='cursor' className='formula-cursor-wrapper' ref={cursorRef}>
            <div className='formula-cursor'></div>
            {inputValue && (
              <div className='formula-typing-text'>{inputValue}</div>
            )}
          </div>
        )
      }

      if (i < elementsWithoutCursors.length) {
        result.push(elementsWithoutCursors[i])
      }
    }

    return result
  }

  return (
    <div className='formula-input-container'>
      <div
        className='formula-input'
        ref={containerRef}
        onClick={handleContainerClick}
      >
        {renderFormulaElements()}

        <input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          className='formula-hidden-input'
        />
      </div>

      {currentInput && suggestions.length > 0 && (
        <AutocompleteDropdown
          suggestions={suggestions}
          selectedIndex={selectedSuggestionIndex}
          onSelect={handleSuggestionSelect}
          onHoverChange={setSelectedSuggestionIndex}
          position={dropdownPosition}
        />
      )}

      <div className='formula-actions'>
        <button className='formula-button' onClick={handleCalculate}>
          Calculate
        </button>
        <button className='formula-button' onClick={handleClear}>
          Clear
        </button>
      </div>

      {result !== null && (
        <div className='formula-result'>Result: {result}</div>
      )}
    </div>
  )
}

export default FormulaInput
