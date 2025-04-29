import { Entity, Column, PrimaryGeneratedColumn, AfterInsert,AfterUpdate,AfterRemove,BeforeInsert,BeforeUpdate, BeforeRecover, BeforeRemove } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  afterUpdate(){
    console.log('after update')
  }

  @BeforeUpdate()
  BeforeUpdate(){
    console.log('before update')
  }

  @AfterRemove()
  afterRemove(){
    console.log('before remove')
  }

  @BeforeInsert()
  beforeInsert(){
    console.log('befoere insert')
  }
}
