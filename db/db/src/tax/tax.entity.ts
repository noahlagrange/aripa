import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Tax {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field( () => Int)
    @Column()
    price: number;

    @Field( () => Int)
    @Column()
    boatId: number;

    @Field()
    @Column('date')
    date: string;
}