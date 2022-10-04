import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen, renderHook, waitFor } from "@testing-library/react";
import { useTitleCase } from "./use-title-case";
import { TitleCaseProvider } from "./title-case";

describe("useTitleCase hook", () => {
  test("default", () => {
    const {
      result: { current },
    } = renderHook(() => useTitleCase());

    expect(current("this is a title")).toBe("This Is a Title");
  });
  test("with overrides passed to hook", () => {
    const {
      result: { current },
    } = renderHook(() => useTitleCase({ overrides: ["tItLe"] }));
    expect(current("this is a title")).toBe("This Is a tItLe");
  });

  test("with overrides from context", async () => {
    const Component = (): JSX.Element => {
      const titleFn = useTitleCase();
      return <div data-testid="ctx-overrides">{titleFn("I'm in a context pRoViDeR")}</div>;
    };
    render(
      <TitleCaseProvider overrides={["pRoViDeR"]}>
        <Component />
      </TitleCaseProvider>,
    );
    await waitFor(() => screen.findByTestId("ctx-overrides"));
    expect(screen.getByTestId<HTMLDivElement>("ctx-overrides").textContent).toBe(
      "I'm in a Context pRoViDeR",
    );
  });
});
