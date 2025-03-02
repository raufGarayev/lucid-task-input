import { QueryClient, QueryClientProvider } from 'react-query'
import './App.css'
import FormulaInput from './components/FormulaInput'

const queryClient = new QueryClient()

function App () {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='app'>
        <header className='app-header'>
          <h1>Formula Input</h1>
          <p>
            Enter mathematical expressions with formula tags, operators, and
            numbers
          </p>
        </header>
        <main className='app-main'>
          <FormulaInput />
        </main>
        <footer className='app-footer'>
          <p>Instructions:</p>
          <ul>
            <li>Type variable names to search for tags</li>
            <li>Use mathematical operators: +, -, *, /, ^, (, )</li>
            <li>Click on tags to edit them</li>
            <li>Press Backspace to delete elements</li>
            <li>Use arrow keys to navigate</li>
          </ul>
        </footer>
      </div>
    </QueryClientProvider>
  )
}

export default App
