import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Int } from '@nestjs/graphql';
import { Tax } from '../tax/tax.entity';

@ObjectType()
@Entity()
export class Boat {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  type: string;
  
  @Field(() => Int)
  @Column()
  owner: number;
  
  @Field(() => [Tax], { nullable: true })
  @ManyToMany(() => Tax)
  @JoinTable()
  taxes: Tax[];
}
