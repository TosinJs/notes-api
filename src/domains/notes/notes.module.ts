import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotesController } from './controllers/notes.controller';
import { NotesService } from './services/notes.service';
import { DBService } from './database/service/db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './database/schemas/note.schema';
import { VerifyIDToken } from './middleware/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  controllers: [NotesController],
  providers: [NotesService, DBService],
})
export class NotesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyIDToken).forRoutes('notes');
  }
}
