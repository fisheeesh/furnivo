import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './routes'
import { ThemeProvider } from "@/components/ThemeProvider"

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router />
  </ThemeProvider>
)
