import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { ErrorBoundary } from "../root";

describe("ErrorBoundary", () => {
  it("renders Arabic shell and home link for unexpected errors", () => {
    render(
      <MemoryRouter>
        <ErrorBoundary params={{}} error={new Error("Unexpected")} />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /عذرًا/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /العودة إلى الصفحة الرئيسية/ }),
    ).toBeInTheDocument();
    // في وضع التطوير تُعرض رسالة الخطأ الأصلية
    expect(screen.getByText("Unexpected")).toBeInTheDocument();
  });
});
