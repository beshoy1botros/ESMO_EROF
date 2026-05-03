import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it("renders copyright and church attribution", () => {
    render(<Footer />);
    expect(
      screen.getByText(/كنيسة السيدة العذراء مريم/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });
});

