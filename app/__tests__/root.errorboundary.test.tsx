import { render, screen } from '@testing-library/react';
import * as ReactRouter from 'react-router';
import { ErrorBoundary } from '../root';

describe('ErrorBoundary', () => {
  it('renders localized fallback when generic error occurs', () => {
    render(
      <ErrorBoundary
        error={new Error('Unexpected')}
        // @ts-expect-error: route prop is provided by router at runtime
        route={{} as any}
      />
    );
    expect(screen.getByText(/حدث خطأ غير متوقع/i)).toBeInTheDocument();
  });
});
