import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { AppProviders } from '@/app/providers'
import { routes } from '@/app/router'

/** Paneli verilen adreste bellek içi router ile açar. */
export function renderApp(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const user = userEvent.setup()
  return { user, router, ...render(<AppProviders router={router} />) }
}
