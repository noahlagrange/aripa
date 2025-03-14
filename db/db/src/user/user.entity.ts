import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Boat } from '../boat/boat.entity';

@ObjectType()
@Entity()
export class User {
  @Field( () => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;
  
  @Field()
  @Column()
  phone: string;

  @Field(() => [Boat], { nullable: true })
  @ManyToMany(() => Boat)
  @JoinTable()
  boats: Boat[];
}
