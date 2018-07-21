import { Column, Entity, Generated, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @Column()
  @Generated("uuid")
  public uuid?: string;

  @PrimaryColumn() public sub: string;

  @Column({ nullable: true })
  public username?: string;

  constructor(sub: string) {
    this.sub = sub;
  }
}
