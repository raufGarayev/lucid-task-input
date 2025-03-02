import { useQuery } from 'react-query';
import axios from 'axios';

export interface Suggestion {
    id: string;
    display: string;
    description: string;
}

interface ApiResponseItem {
    name: string;
    category: string;
    value: number;
    id: string;
}

const variableMapping: Record<string, string> = {
    "revenue": "revenue",
    "income": "revenue",
    "sales": "revenue",
    "cost": "cost",
    "expense": "cost",
    "profit": "profit",
    "margin": "margin",
    "growth": "growth",
    "customer": "customers",
    "churn": "churn",
    "acquisition": "acquisition",
};

const findMatchingVariableKey = (name: string): string => {
    const lowerName = name.toLowerCase();

    for (const [pattern, key] of Object.entries(variableMapping)) {
        if (lowerName === pattern) {
            return key;
        }
    }

    for (const [pattern, key] of Object.entries(variableMapping)) {
        if (lowerName.includes(pattern)) {
            return key;
        }
    }

    return lowerName;
};

const fetchSuggestions = async (inputText: string): Promise<Suggestion[]> => {
    const endpoint = 'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete';

    if (!inputText || inputText.trim() === '') {
        return [];
    }

    try {
        const response = await axios.get<ApiResponseItem[]>(endpoint);

        const transformedData: Suggestion[] = response.data
            .filter(item =>
                item.name.toLowerCase().includes(inputText.toLowerCase()) ||
                item.category.toLowerCase().includes(inputText.toLowerCase())
            )
            .map(item => {
                const variableKey = findMatchingVariableKey(item.name);

                return {
                    id: variableKey,
                    display: item.name,
                    description: `${item.category} (Value: ${item.value})`
                };
            });

        const staticSuggestions = getStaticSuggestions(inputText);

        return [...transformedData, ...staticSuggestions];
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);

        return getStaticSuggestions(inputText);
    }
};

const getStaticSuggestions = (inputText: string): Suggestion[] => {
    const allSuggestions: Suggestion[] = [
        { id: 'revenue', display: 'Revenue', description: 'Total revenue' },
        { id: 'cost', display: 'Cost', description: 'Total cost' },
        { id: 'profit', display: 'Profit', description: 'Revenue minus cost' },
        { id: 'margin', display: 'Margin', description: 'Profit as a percentage of revenue' },
        { id: 'growth', display: 'Growth', description: 'Percentage growth in revenue' },
        { id: 'customers', display: 'Customers', description: 'Number of customers' },
        { id: 'churn', display: 'Churn', description: 'Percentage of customers lost' },
        { id: 'acquisition', display: 'Acquisition', description: 'Number of new customers' },
        { id: 'sum', display: 'SUM', description: 'Sum of values' },
        { id: 'average', display: 'AVERAGE', description: 'Average of values' },
        { id: 'min', display: 'MIN', description: 'Minimum value' },
        { id: 'max', display: 'MAX', description: 'Maximum value' }
    ];

    return allSuggestions.filter(suggestion =>
        suggestion.id.toLowerCase().includes(inputText.toLowerCase()) ||
        suggestion.display.toLowerCase().includes(inputText.toLowerCase())
    );
};

const useAutocomplete = (inputText: string) => {
    return useQuery<Suggestion[], Error, Suggestion[], [string, string]>(
        ['autocomplete', inputText],
        () => fetchSuggestions(inputText),
        {
            enabled: inputText !== undefined && inputText.length > 0,
            staleTime: 60000,
            cacheTime: 300000,
            refetchOnWindowFocus: false,
            select: (data) => data || [],
            placeholderData: [],
        }
    );
};

export default useAutocomplete;