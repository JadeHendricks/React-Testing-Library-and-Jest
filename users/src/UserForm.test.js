import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import UserForm from "./UserForm";

test("it shows two inputs and a button", () => {
    //1) render the component
    render(<UserForm />); //we have isolated the UserformComponent and testing it by itself

    //2) manipulate the component or find an element in it
    const inputs = screen.getAllByRole("textbox"); //get everything on the page that has a role of textbox (ARIA ROLE)
    const button = screen.getByRole("button"); //get everything on the page that has a role of button (ARIA ROLE)

    //3) assertion - make sure the component is doing what we expect it to do
    expect(inputs).toHaveLength(2);
    expect(button).toBeInTheDocument();
});

test("it calls onUserAdd when the form is submitted", async () => {
    const mock = jest.fn(); //this is how we create a mock function

    //try to render my component
    render(<UserForm onUserAdd={mock} />);

    //find the two inputs
    // const [nameInput, emailInput] = screen.getAllByRole("textbox"); //not an optimal way to do this
    const nameInput = screen.getByRole("textbox", {name: /name/i}); //the i here says to not care about the case of the input
    const emailInput = screen.getByRole("textbox", {name: /email/i});

    //simulate typing in a name
    await user.click(nameInput);
    await user.keyboard("jane");

    //simulate typng in an email
    await user.click(emailInput);
    await user.keyboard("jane@jane.com");

    //find the button
    const button = screen.getByRole("button");

    //simulate clicking the button
    await user.click(button);

    //assertion to make sure "onUserAdd" gets called with email/name
    //make sure the mock function was called
    expect(mock).toHaveBeenCalled();
    //make sure it received the appropriate arguments
    expect(mock).toHaveBeenCalledWith({ name: "jane", email: "jane@jane.com" });
});
