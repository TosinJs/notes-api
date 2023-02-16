import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { createSuccessResponse } from 'src/utils/response-builder.utils';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { User } from '../decorators/user.decorator';
import { ValidateMongoId } from '../pipes/mongoid.pipe';

@Controller('notes')
export class NotesController {
  constructor(private readonly noteService: NotesService) {}

  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @User() user: tokenPayload,
  ) {
    createNoteDto.userId = user.id;
    return createSuccessResponse(
      HttpStatus.CREATED,
      'Success',
      await this.noteService.create(createNoteDto),
    );
  }

  @Get()
  async findAll(@User() user: tokenPayload) {
    const notes = await this.noteService.findAll(user.id);
    if (notes.length < 1) {
      throw new HttpException(
        'notes not found for this user',
        HttpStatus.NOT_FOUND,
        { cause: new Error('Notes Not Found') },
      );
    }
    return createSuccessResponse(HttpStatus.OK, 'Success', notes);
  }

  @Get(':noteId')
  async findOne(
    @Param('noteId', ValidateMongoId) noteId: string,
    @User() user: tokenPayload,
  ) {
    const note = await this.noteService.findOne(noteId, user.id);
    if (!note) {
      throw new HttpException('Note not found', HttpStatus.NOT_FOUND, {
        cause: new Error('Note Not Found'),
      });
    }
    return createSuccessResponse(HttpStatus.OK, 'Success', note);
  }

  @Patch(':noteId')
  async update(
    @Param('noteId', ValidateMongoId) noteId: string,
    @User() user: tokenPayload,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const res = await this.noteService.update(noteId, user.id, updateNoteDto);
    if (!res) {
      throw new HttpException(
        'invalid note id - update failed',
        HttpStatus.BAD_REQUEST,
        { cause: new Error('Failed to Update Note') },
      );
    }
    return createSuccessResponse(HttpStatus.OK, 'Success', res);
  }

  @Delete(':noteId')
  async delete(
    @Param('noteId', ValidateMongoId) noteId: string,
    @User() user: tokenPayload,
  ) {
    const res = await this.noteService.delete(noteId, user.id);
    if (!res) {
      throw new HttpException(
        'note not found - delete failed',
        HttpStatus.BAD_REQUEST,
        { cause: new Error('Failed to Update Note') },
      );
    }
    return createSuccessResponse(HttpStatus.OK, 'Success', res);
  }
}
