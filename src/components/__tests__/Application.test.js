import React from "react";

import { fireEvent, render, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, wait } from "@testing-library/react";

import { waitForElement } from "@testing-library/react";

import axios from "axios"

import Application from "../Application";

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"))
      
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"))

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Edit" button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Click "Sylvia Palmer"
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 5. Click Save
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the element with "Saving" is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 7. Wait until the element "Archie Cohen" is displayed
    await waitForElement(() => getByText(appointment, "Archie Cohen"));

    // 8. Check that "Sylvia Palmer" is the interviewer for "Archie Cohen"
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    // 9. Check the the DayListItem with the text "Monday" also has the text "1 spot remaining"
    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Start making a new appointment
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    // 4. Fill in the appointment info
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones"}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 5. Click "Save"
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the element with "Saving" is being displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 7. Wait until the element "Error" is being displayed
    await waitForElement(() => getByText(appointment, "Error"));
  })

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Click the "Delete" button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"))

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    // 7. Wait until the element "Error" is being displayed
    await waitForElement(() => getByText(appointment, "Error"));
  })

})