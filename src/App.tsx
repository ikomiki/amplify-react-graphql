import {
  Button,
  Card,
  Heading,
  Image,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import logo from "./assets/react.svg";

import { Amplify, API } from "aws-amplify";
import { MouseEventHandler, useEffect, useState } from "react";
import { Note } from "./API";
import config from "./aws-exports";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import { listNotes } from "./graphql/queries";

Amplify.configure(config);

type FormState = {
  name: string;
  description: string;
};
const initialFormState: FormState = { name: "", description: "" };

type ListNotesResponse = {
  data: { listNotes: { items: Note[]; nextToken: string | null } };
};
type CreateNotesResponse = {
  data: { createNote: Note };
};

function App({ signOut }: { signOut: MouseEventHandler<HTMLButtonElement> }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = (await API.graphql<ListNotesResponse>({
      query: listNotes,
    })) as ListNotesResponse;
    console.log("apiData", apiData);
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    const apiData = (await API.graphql<CreateNotesResponse>({
      query: createNoteMutation,
      variables: { input: formData },
    })) as CreateNotesResponse;
    console.log("apiData", apiData);
    setNotes([...notes, apiData.data.createNote]);
    setFormData(initialFormState);
  }

  async function deleteNote(id: string) {
    const newNotesArray = notes.filter((note) => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note.id)}>Delete note</button>
          </div>
        ))}
      </div>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}

export default withAuthenticator(App) as () => JSX.Element;
