import { Entity, PrimaryColumn, Generated, Column } from "typeorm";

@Entity()
export class User {
  @Column()
  @Generated("uuid")
  uuid?: string;

  @PrimaryColumn() sub: string;

  @Column({ nullable: true })
  username?: string;

  constructor(sub: string) {
    this.sub = sub;
  }
}
