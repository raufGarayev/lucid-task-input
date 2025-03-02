import * as math from 'mathjs';
import { FormulaElement } from '../store/formulaStore';

const dummyVariables: Record<string, number> = {
    'revenue': 1000,
    'cost': 500,
    'profit': 500,
    'margin': 0.5,
    'growth': 0.2,
    'customers': 100,
    'churn': 0.1,
    'acquisition': 20
};

export const calculateFormula = (formulaElements: FormulaElement[]): number | string => {
    try {
        let expressionString = '';

        formulaElements.forEach(element => {
            if (element.type === 'tag') {
                const value = dummyVariables[element.value] !== undefined
                    ? dummyVariables[element.value]
                    : 0;
                expressionString += value;
            } else if (element.type === 'operator') {
                expressionString += element.value;
            } else if (element.type === 'number') {
                expressionString += element.value;
            }
        });

        try {
            const parsedExpression = math.parse(expressionString);
            const compiledExpression = parsedExpression.compile();
            const result = compiledExpression.evaluate(dummyVariables);
            return result;
        } catch (mathError) {
            console.warn('MathJS evaluation failed, falling back to eval:', mathError);

            const result = eval(expressionString);
            return result;
        }
    } catch (error) {
        console.error('Error calculating formula:', error);
        return 'Error';
    }
};

export const formulaElementsToString = (formulaElements: FormulaElement[]): string => {
    let expressionString = '';

    formulaElements.forEach(element => {
        if (element.type === 'tag') {
            expressionString += element.value;
        } else if (element.type === 'operator') {
            expressionString += element.value;
        } else if (element.type === 'number') {
            expressionString += element.value;
        }
    });

    return expressionString;
};

export const validateFormula = (formulaElements: FormulaElement[]): boolean => {
    try {
        const expressionString = formulaElementsToString(formulaElements);

        math.parse(expressionString);

        return true;
    } catch (error) {
        return false;
    }
};

export const getElementTypeFromInput = (input: string): 'number' | 'operator' | 'tag' => {
    if (/^\d+$/.test(input)) {
        return 'number';
    } else if (['+', '-', '*', '/', '^', '(', ')'].includes(input)) {
        return 'operator';
    } else {
        return 'tag';
    }
};