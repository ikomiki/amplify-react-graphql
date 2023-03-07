import { Button, withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { Amplify, API, Storage } from "aws-amplify";
import { FormEvent, MouseEventHandler, useEffect, useState } from "react";
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
  image?: string;
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
    // console.log("apiData", apiData);
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const image = await Storage.get(note.image);
          note.image = image as string;
        }
        return note;
      })
    );
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    const apiData = (await API.graphql<CreateNotesResponse>({
      query: createNoteMutation,
      variables: { input: formData },
    })) as CreateNotesResponse;
    const newNote = apiData.data.createNote;
    if (formData.image) {
      const image = await Storage.get(formData.image);
      newNote.image = image as string;
    }
    // console.log("apiData", apiData);
    setNotes([...notes, newNote]);
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

  async function onChange(e: FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement;
    if (!target.files?.[0]) return;
    const file = target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
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
      <input type="file" onChange={onChange} />
      <button onClick={createNote}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {notes.map((note) => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            <button onClick={() => deleteNote(note.id)}>Delete note</button>
            {note.image && <img src={note.image} style={{ width: 400 }} />}
          </div>
        ))}
      </div>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}

export default withAuthenticator(App) as () => JSX.Element;
