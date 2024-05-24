import UserForm from "./UserForm";
import UserList from "./UserList";
import { useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  const onUserAdd = (user) => {
    setUsers([...users, user]);
  }

  return (
    <div>
      <UserForm onUserAdd={onUserAdd} />
      <hr />
      <UserList users={users} />
    </div>
  );
}

export default App;
