import { render, screen, within } from "@testing-library/react";
import UserList from "./UserList";

function createUsers() {
    //we only adding users here as a way to keep my notes intact
    const users = [
        { name: "jane", email: "jane@jane.com" },
        { name: "sam", email: "sam@sam.com" },
    ];

    return { users };
}

test("render one row per user", () => {
    //creating a list of fake users
    const { users } = createUsers();

    //render the component
    //const {container} = render(<UserList users={users} />); //the container is automatically added in whenever we render our component (an outter DIV)
    render(<UserList users={users} />);
    
    //find all the rows in the table
    //screen.logTestingPlaygroundURL();
    //const rows = container.querySelectorAll("tbody tr"); //another way of getting something without manipulating the HTML
    const rows = within(screen.getByTestId("users")).getAllByRole("row");

    //assertion: correct number of rows in the table
    expect(rows).toHaveLength(2);
});

test("render the email and name of each user", () => {
    const { users } = createUsers();

    //render the component
    render(<UserList users={users} />);

    for (let user of users) {
        const name = screen.getByRole("cell", { name: user.name });
        const email = screen.getByRole("cell", { name: user.email });
    
        expect(name).toBeInTheDocument();
        expect(email).toBeInTheDocument();
    }
});