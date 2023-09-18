import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("note")
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.notes)
  @Index("idx_user_id")
  user: User;

  @Column({ default: false })
  isDeleted: Boolean;

  @Column()
  title: String;

  @Column()
  description: String;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;
}

export type NoteReturnType = Omit<
  Note,
  "id | created_on | updated_on | is_deleted"
>;
