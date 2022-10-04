import * as React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { TitleCase } from "./title-case";

describe("TitleCase Component", () => {
  test("default", async () => {
    render(
      <div data-testid="component-default">
        <TitleCase>it's in a component</TitleCase>
      </div>,
    );

    await waitFor(() => screen.findByTestId("component-default"));
    expect(screen.getByTestId("component-default").textContent).toBe("It's in a Component");
  });

  test("with overrides", async () => {
    render(
      <div data-testid="component-overrides">
        <TitleCase overrides={["cOmPoNeNt"]}>it's in a cOmPoNeNt</TitleCase>
      </div>,
    );

    await waitFor(() => screen.findByTestId("component-overrides"));
    expect(screen.getByTestId("component-overrides").textContent).toBe("It's in a cOmPoNeNt");
  });
});
