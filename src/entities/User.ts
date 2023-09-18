import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Note } from "./Note";
import bcrypt from "bcryptjs";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  created_on: Date;

  @UpdateDateColumn()
  updated_on: Date;

  @Column({ default: false })
  is_deleted: boolean;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @BeforeInsert()
  async hashPassword() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
export type UserOmitReturnType = Omit<
  User,
  "id | created_on | updated_on | is_deleted | notes | hashPassword | checkPassword"
>;

export interface UserReturnType {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  password?: string | null;
  created_on?: Date;
  updated_on?: Date;
  is_deleted?: boolean;
}

export interface UserRequestType {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  password?: string | null;
  is_deleted?: boolean | false;
}
