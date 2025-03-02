import { create } from 'zustand';

export type TagElement = {
    type: 'tag';
    value: string;
    display?: string;
};

export type OperatorElement = {
    type: 'operator';
    value: string;
};

export type NumberElement = {
    type: 'number';
    value: string;
};

export type FormulaElement = TagElement | OperatorElement | NumberElement;

interface FormulaState {
    formulaElements: FormulaElement[];
    cursorPosition: number;
    showAutocomplete: boolean;
    currentInput: string;
    result: number | string | null;
    variableValues: Record<string, number>;

    addElement: (element: FormulaElement) => void;
    removeElement: (index: number) => void;
    updateElement: (index: number, newElement: FormulaElement) => void;
    setCursorPosition: (position: number) => void;
    setShowAutocomplete: (show: boolean) => void;
    setCurrentInput: (text: string) => void;
    clearFormula: () => void;
    calculateResult: () => number | string;
    setVariableValue: (key: string, value: number) => void;
}

const initialVariableValues: Record<string, number> = {
    'revenue': 1000,
    'cost': 500,
    'profit': 500,
    'margin': 0.5,
    'growth': 0.2,
    'customers': 100,
    'churn': 0.1,
    'acquisition': 20
};

const useFormulaStore = create<FormulaState>((set, get) => ({
    formulaElements: [],

    cursorPosition: 0,

    showAutocomplete: false,

    currentInput: '',

    result: null,

    variableValues: initialVariableValues,

    addElement: (element: FormulaElement) => {
        set((state) => {
            const newElements = [...state.formulaElements];
            newElements.splice(state.cursorPosition, 0, element);
            return {
                formulaElements: newElements,
                cursorPosition: state.cursorPosition + 1,
                currentInput: ''
            };
        });
    },

    removeElement: (index: number) => {
        set((state) => {
            const newElements = [...state.formulaElements];
            newElements.splice(index, 1);
            return {
                formulaElements: newElements,
                cursorPosition: Math.min(index, newElements.length)
            };
        });
    },

    updateElement: (index: number, newElement: FormulaElement) => {
        set((state) => {
            const newElements = [...state.formulaElements];
            newElements[index] = newElement;
            return { formulaElements: newElements };
        });
    },

    setCursorPosition: (position: number) => {
        set({ cursorPosition: position });
    },

    setShowAutocomplete: (show: boolean) => {
        set({ showAutocomplete: show });
    },

    setCurrentInput: (text: string) => {
        set({
            currentInput: text,
            showAutocomplete: text.length > 0
        });
    },

    clearFormula: () => {
        set({
            formulaElements: [],
            cursorPosition: 0,
            currentInput: '',
            result: null
        });
    },

    setVariableValue: (key: string, value: number) => {
        set((state) => ({
            variableValues: {
                ...state.variableValues,
                [key]: value
            }
        }));
    },

    calculateResult: () => {
        const { formulaElements, variableValues } = get();
        let formula = '';

        formulaElements.forEach(element => {
            if (element.type === 'tag') {
                const value = variableValues[element.value] !== undefined
                    ? variableValues[element.value]
                    : 0;
                formula += value;
            } else if (element.type === 'operator') {
                formula += element.value;
            } else if (element.type === 'number') {
                formula += element.value;
            }
        });

        try {
            const result = eval(formula) as number;
            set({ result });
            return result;
        } catch (error) {
            console.error('Error calculating formula:', error);
            set({ result: 'Error' });
            return 'Error';
        }
    }
}));

export default useFormulaStore;