import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  note: string;

  @Prop({ required: true })
  userId: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
