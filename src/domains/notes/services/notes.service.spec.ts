import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { DBService } from '../database/service/db.service';
import { mongo } from 'mongoose';

describe('NotesService', () => {
  let service: NotesService;
  let dbService: DBService;

  const userId = new mongo.ObjectId().toString();
  const noteId = new mongo.ObjectId();
  const note = {
    note: 'username',
    title: 'title',
    userId: userId,
  };

  const savedNote = {
    _id: noteId,
    note: note.note,
    title: note.title,
    userId: note.userId,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: DBService,
          useFactory: () => ({
            createNote: jest.fn().mockImplementation(async () => savedNote),
            find: jest.fn().mockImplementation(async () => [savedNote]),
            findById: jest.fn(async () => savedNote),
            updateNote: jest.fn(),
            deleteNote: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    dbService = module.get<DBService>(DBService);
  });

  describe('create note', () => {
    it('should create a new note', async () => {
      const newNote = await service.create(note);
      expect(dbService.createNote).toBeCalledWith(note);
      expect(newNote).toEqual(savedNote);
    });
  });

  describe('find all notes', () => {
    it('should retrun an array of notes', async () => {
      const notes = await service.findAll(userId);
      expect(dbService.find).toBeCalledWith(userId);
      expect(notes).toEqual([savedNote]);
    });
  });

  describe('find note by id', () => {
    it('should return a note', async () => {
      const note = await service.findOne(noteId.toString(), userId);
      expect(dbService.findById).toBeCalledWith(noteId.toString(), userId);
      expect(note).toEqual(savedNote);
    });
  });

  describe('update a note', () => {
    it('should return the updated note', async () => {
      const update = { title: 'new title' };
      await service.update(noteId.toString(), userId, update);
      expect(dbService.updateNote).toBeCalledWith(
        noteId.toString(),
        userId,
        update,
      );
    });
  });

  describe('delete note', () => {
    it('should delete note', async () => {
      await service.delete(noteId.toString(), userId);
      expect(dbService.deleteNote).toBeCalledWith(noteId.toString(), userId);
    });
  });
});
