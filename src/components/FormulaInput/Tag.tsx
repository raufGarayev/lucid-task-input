import React, { useState } from 'react'
import './FormulaInput.css'
import TagEditor from './TagEditor'
import { TagElement } from '../../store/formulaStore'

interface TagProps {
  tag: TagElement
  index: number
  onUpdate: (index: number, newTag: TagElement) => void
  isSelected: boolean
}

const Tag: React.FC<TagProps> = ({ tag, index, onUpdate, isSelected }) => {
  const [showEditor, setShowEditor] = useState<boolean>(false)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
    setShowEditor(true)
  }

  const handleCloseEditor = (): void => {
    setShowEditor(false)
  }

  const handleUpdateTag = (newValue: string): void => {
    onUpdate(index, {
      ...tag,
      value: newValue
    })
    setShowEditor(false)
  }

  return (
    <div
      className={`formula-tag ${isSelected ? 'formula-tag-selected' : ''}`}
      onClick={handleClick}
    >
      {tag.display || tag.value}

      {showEditor && (
        <TagEditor
          tag={tag}
          onClose={handleCloseEditor}
          onUpdate={handleUpdateTag}
        />
      )}
    </div>
  )
}

export default Tag
