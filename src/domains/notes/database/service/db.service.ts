import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../schemas/note.schema';

export class DBService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async createNote(note: Partial<Note>) {
    const newNote = new this.noteModel();
    newNote.note = note.note;
    newNote.title = note.title;
    newNote.userId = note.userId;
    await newNote.save();
    return newNote;
  }

  async find(userId: string) {
    const notes = await this.noteModel.find({ userId });
    return notes;
  }

  async findById(_id: string, userId: string) {
    const note = await this.noteModel.findOne({ _id, userId });
    return note;
  }

  async updateNote(_id: string, userId: string, update: Partial<Note>) {
    const note = await this.noteModel.findOneAndUpdate({ _id, userId }, update);
    return note;
  }

  async deleteNote(_id: string, userId: string) {
    const res = await this.noteModel.findOneAndDelete({ _id, userId });
    return res;
  }
}
