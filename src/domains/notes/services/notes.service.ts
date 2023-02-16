import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { DBService } from '../database/service/db.service';
import { Note } from '../database/schemas/note.schema';
import {
  ConfilctError,
  InternalServerError,
} from 'src/utils/error-response.utils';

@Injectable()
export class NotesService {
  constructor(private dbService: DBService) {}

  async create(createNoteDto: CreateNoteDto) {
    try {
      const note = await this.dbService.createNote(createNoteDto);
      return note.toJSON();
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        throw new ConfilctError(
          'duplicate entry - this username already exists',
          error,
        );
      } else throw new InternalServerError(error);
    }
  }

  async findAll(userId: string) {
    try {
      const notes = await this.dbService.find(userId);
      return notes;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const note = await this.dbService.findById(id, userId);
      return note;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }

  async update(id: string, userId: string, updateNoteDto: UpdateNoteDto) {
    const update: Partial<Note> = {
      ...(updateNoteDto.note && { note: updateNoteDto.note }),
      ...(updateNoteDto.title && { title: updateNoteDto.title }),
    };
    try {
      const note = await this.dbService.updateNote(id, userId, update);
      return note;
    } catch (error) {
      console.log(error);
      throw new InternalServerError(error);
    }
  }

  async delete(id: string, userId: string) {
    try {
      const res = await this.dbService.deleteNote(id, userId);
      return res;
    } catch (error) {
      throw new InternalServerError(error);
    }
  }
}
