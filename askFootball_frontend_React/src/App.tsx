import AskFootballHome from './pages/AskFootballHome'
import { QueryProvider } from './app/providers/QueryProvider'
import { ThemeProvider } from './Contexts/ThemeContext'

function App() {
  return (
    <div className="body bg-background">
      <QueryProvider>
        <ThemeProvider>
          <AskFootballHome />
        </ThemeProvider>
      </QueryProvider>
    </div>
  )
}

export default App
