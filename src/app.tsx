import { ChangeEvent, useState } from 'react';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';
import { toast } from 'sonner';
import { Zap } from 'lucide-react';

interface Note {
  id: string;
  date: Date;
  content: string;
  typeNote: string;
  priority?: string;
  imageUrl?: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onNoteCreated(
    content: string,
    typeNote: string,
    priority?: string,
    imageUrl?: string
  ) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
      typeNote,
      priority,
      imageUrl,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(notesArray);

    localStorage.setItem('notes', JSON.stringify(notesArray));

    toast.success('Nota excluída!');
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  function onNoteEdited(
    id: string,
    newContent: string,
    newTypeNote: string,
    newPriority?: string,
    newImageUrl?: string
  ) {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          ...note,
          content: newContent,
          typeNote: newTypeNote,
          priority: newPriority,
          imageUrl: newImageUrl,
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

    toast.success('Nota editada!');
  }

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className='mx-auto max-w-6xl my-10 space-y-6 px-5'>
      <div className='flex gap-5  text-sm'>
        <img src={logo} alt='NLW Expert' />
        <p className='flex gap-1  items-center text-slate-300'>
          Feito por
          <a
            href='https://github.com/net0well/nlw-expert'
            target='_blank'
            className='flex gap-1 items-center text-green-400 hover:text-green-300 '
          >
            Wellington Neto
            <Zap className='size-5 text-green-400 hover:text-green-300 ' />
          </a>
        </p>
      </div>
      <form className='w-full'>
        <input
          type='text'
          placeholder='Busque em suas notas...'
          className='w-full bg-transparent text-3x1
         font-semibold tracking-tight placeholder:text-slate-500 outline-none'
          onChange={handleSearch}
        />
      </form>
      <div className='h-px bg-slate-700' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return (
            <NoteCard
              key={note.id}
              note={note}
              onNoteDeleted={onNoteDeleted}
              onNoteEdited={onNoteEdited}
            />
          );
        })}
      </div>
    </div>
  );
}
