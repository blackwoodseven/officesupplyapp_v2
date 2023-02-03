import {
   render as rtlRender,
   screen,
   waitForElementToBeRemoved,
} from '@testing-library/react'

const waitForLoadingToFinish = () =>
   waitForElementToBeRemoved(
      () => [
         ...screen.queryAllByLabelText(/loading/i),
         ...screen.queryAllByText(/loading/i),
      ],
      { timeout: 4000 },
   )

export * from '@testing-library/react'
export { waitForLoadingToFinish }
